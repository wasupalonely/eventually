import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as QRCode from 'qrcode';
import * as moment from 'moment';
import { Invitation } from './entities/invitation.entity';
import {
  CreateInvitationInput,
  SendInvitationInput,
  UpdateInvitationInput,
} from './dto/inputs';
import { GuestsService } from 'src/guests/guests.service';
import { EventsService } from 'src/events/events.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { SendWhatsAppMessageDto } from 'src/notifications/dto';
import { EventType } from 'src/events/enums/event-type.enum';

@Injectable()
export class InvitationsService {
  private logger = new Logger('InvitationsService');
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepository: Repository<Invitation>,
    private readonly guestsService: GuestsService,
    private readonly eventsService: EventsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(
    createInvitationInput: CreateInvitationInput,
  ): Promise<Invitation> {
    try {
      const { eventId, guestId } = createInvitationInput;

      const event = await this.eventsService.findOne(eventId);
      const guest = await this.guestsService.findOne(guestId);

      if (!event || !guest) {
        throw new BadRequestException('Evento o invitado no encontrado');
      }

      const confirmationUrl = `${process.env.CLIENT_URL}/confirm-invitation/${guestId}`;

      const qrCodeUrl = await QRCode.toDataURL(confirmationUrl);

      const expirationDate = moment(event.startDate)
        .subtract(2, 'hours')
        .toDate();

      const invitation = this.invitationRepository.create({
        event,
        guest,
        confirmationUrl,
        qrCodeUrl,
        expirationDate,
      });

      return await this.invitationRepository.save(invitation);
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async sendInvitations(
    sendInvitationInput: SendInvitationInput,
  ): Promise<void> {
    const event = await this.eventsService.findOne(sendInvitationInput.eventId);

    if (sendInvitationInput.guestIds) {
      sendInvitationInput.guestIds.forEach(async (guestId) => {
        const invitation = await this.invitationRepository.findOneBy({
          event: { id: event.id },
          guest: { id: guestId },
        });

        const guest = await this.guestsService.findOne(guestId);

        if (invitation) {
          if (guest.email) {
            await this.notificationsService.sendEmail({
              to: guest.email,
              subject: `Invitación a ${event.name}`,
              template: 'invitation',
              context: {
                event,
                guest,
                invitation,
              },
            });
          }

          if (guest.phoneNumber) {
            const body = `
  Hola ${guest.name}!,
  
  Estás invitado al evento ${event.name}.

  ${
    event.type === EventType.IN_PERSON
      ? `Este será el ${event.startDate} en ${event.location}.`
      : event.type === EventType.VIRTUAL
        ? `Este será el ${event.startDate} a través de ${event.url}.`
        : `Este será el ${event.startDate} en ${event.location} y a través de ${event.url}.`
  }
  
  Escanea el código QR adjunto o confirma tu asistencia aquí: ${invitation.confirmationUrl}.
  
  ¡Te esperamos!
`;
            const message: SendWhatsAppMessageDto = {
              body,
              to: guest.phoneNumber,
              qrCodeUrl: invitation.qrCodeUrl,
            };

            await this.notificationsService.sendWhatsAppMessage(message);
          }
        } else {
          throw new BadRequestException(
            `El invitado ${guest.name} no tiene una invitación para el evento ${event.name}`,
          );
        }
      });
    }
  }

  async findAll(eventId?: string): Promise<Invitation[]> {
    try {
      return this.invitationRepository.find({
        where: { ...(eventId && { event: { id: eventId } }) },
      });
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findOne(id: string): Promise<Invitation> {
    const invitation = await this.invitationRepository.findOneBy({ id });

    if (!invitation) {
      throw new BadRequestException('Invitación no encontrada');
    }

    return invitation;
  }

  async update(
    id: string,
    updateInvitationInput: UpdateInvitationInput,
  ): Promise<Invitation> {
    try {
      const updatedEvent = await this.invitationRepository.preload({
        id: id,
        ...updateInvitationInput,
      });

      if (!updatedEvent) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }

      const event = await this.invitationRepository.save(updatedEvent);
      return await this.invitationRepository.findOne({
        where: { id: event.id },
        relations: ['guest', 'event'],
      });
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  // TODO: Decide if i want to implement this method or add other block-like method
  remove(id: string) {
    return `This action removes a #${id} invitation`;
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please, check server logs');
  }
}
