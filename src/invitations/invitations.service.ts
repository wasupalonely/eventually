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
import { v2 as cloudinary } from 'cloudinary';

import { Invitation } from './entities/invitation.entity';
import {
  CreateInvitationInput,
  SendInvitationInput,
  SendInvitationsResponse,
  UpdateInvitationInput,
} from './dto/inputs';
import { GuestsService } from 'src/guests/guests.service';
import { EventsService } from 'src/events/events.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import {
  SendEmailMessageDto,
  SendWhatsAppMessageDto,
} from 'src/notifications/dto';
import { EventType } from 'src/events/enums/event-type.enum';
import { Guest } from 'src/guests/entities/guest.entity';
import { Event } from 'src/events/entities/event.entity';
import { generateEmailHtml } from './utils/templates/html.template';

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
  ): Promise<SendInvitationsResponse> {
    const event = await this.eventsService.findOne(sendInvitationInput.eventId);
    const notifiedGuests: string[] = [];

    if (sendInvitationInput.guestIds) {
      for (const guestId of sendInvitationInput.guestIds) {
        const invitation = await this.invitationRepository.findOneBy({
          event: { id: event.id },
          guest: { id: guestId },
        });

        const guest = await this.guestsService.findOne(guestId);

        if (invitation) {
          await this.sendNotifications(guest, event, invitation);
          notifiedGuests.push(guestId);
        } else {
          throw new BadRequestException(
            `El invitado ${guest.name} no tiene una invitación para el evento ${event.name}`,
          );
        }
      }
    } else {
      const invitations = await this.findAllByEventId(event.id);

      for (const invitation of invitations) {
        const guest = await this.guestsService.findOne(invitation.guest.id);
        await this.sendNotifications(guest, event, invitation);
        notifiedGuests.push(invitation.guest.id);
      }
    }

    return {
      eventId: event.id,
      notifiedGuests,
    };
  }

  private async sendNotifications(
    guest: Guest,
    event: Event,
    invitation: Invitation,
  ) {
    const uploadResult = await cloudinary.uploader.upload(
      invitation.qrCodeUrl,
      {
        folder: 'event_qrcodes',
        resource_type: 'image',
      },
    );

    if (guest.email) {
      const html = generateEmailHtml(guest, event, {
        ...invitation,
        qrCodeUrl: uploadResult.secure_url,
      });
      const sendEmailMessageDto: SendEmailMessageDto = {
        html,
        subject: `¡Estás Invitado al evento ${event.name}!`,
        to: guest.email,
      };
      await this.notificationsService.sendEmail(sendEmailMessageDto);
    }

    if (guest.phoneNumber) {
      console.log('Sending WhatsApp message to:', guest.name);

      // Construcción del cuerpo del mensaje
      const body = `
    Hola ${guest.name}! 
Estás invitado al evento ${event.name}.
${
  event.type === EventType.IN_PERSON
    ? `Este será el ${moment(event.startDate).format('D [de] MMMM [de] YYYY')} en ${event.location}.`
    : event.type === EventType.VIRTUAL
      ? `Este será el ${moment(event.startDate).format('D [de] MMMM [de] YYYY')} a través de ${event.url}.`
      : `Este será el ${moment(event.startDate).format('D [de] MMMM [de] YYYY')} en ${event.location} y a través de ${event.url}.`
}
Escanea el código QR adjunto o confirma tu asistencia aquí: ${invitation.confirmationUrl}.
¡Te esperamos!`;

      // Mensaje a enviar
      const message: SendWhatsAppMessageDto = {
        body,
        to: guest.phoneNumber,
        qrCodeUrl: uploadResult.secure_url,
      };

      await this.notificationsService.sendWhatsAppMessage(message);
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

  async findAllByEventId(eventId: string): Promise<Invitation[]> {
    try {
      return this.invitationRepository.find({
        where: { event: { id: eventId } },
        relations: ['guest'],
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
