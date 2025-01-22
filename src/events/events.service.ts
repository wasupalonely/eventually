import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventInput, UpdateEventInput } from './dto/inputs';
import { InjectRepository } from '@nestjs/typeorm';
import * as moment from 'moment';
import { Event } from './entities/event.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { EventType } from './enums/event-type.enum';

@Injectable()
export class EventsService {
  private logger = new Logger('EventsService');
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
  ) {}

  private createEventBusinessLogicValidations(
    createEventInput: CreateEventInput | UpdateEventInput,
  ): void {
    // ** Event type validations
    switch (createEventInput.type) {
      case EventType.IN_PERSON:
        if (!createEventInput.location) {
          throw new BadRequestException(
            'Location is required for in-person events',
          );
        }
        break;
      case EventType.VIRTUAL:
        if (!createEventInput.url) {
          throw new BadRequestException('URL is required for virtual events');
        }
        break;
      case EventType.HYBRID:
        if (!createEventInput.location || !createEventInput.url) {
          throw new BadRequestException(
            'Location and URL are required for hybrid events',
          );
        }
        break;
      default:
        throw new BadRequestException('Invalid event type');
    }

    // ** Dates validations
    const startDate = moment(createEventInput.startDate);
    const endDate = moment(createEventInput.endDate);
    const today = moment().startOf('day'); // Inicio del día actual

    // ** Validación: startDate debe ser antes de endDate
    if (startDate.isAfter(endDate)) {
      throw new BadRequestException(
        'The start date must be before the end date',
      );
    }

    // ** Validación: startDate debe ser hoy o en el futuro
    if (startDate.isBefore(today)) {
      throw new BadRequestException(
        'The start date must be in the future or today',
      );
    }

    // ** Validación: endDate debe ser hoy o en el futuro
    if (endDate.isBefore(today)) {
      throw new BadRequestException(
        'The end date must be in the future or today',
      );
    }

    return;
  }

  async create(createEventInput: CreateEventInput, user: User): Promise<Event> {
    try {
      this.createEventBusinessLogicValidations(createEventInput);

      const event = this.eventsRepository.create({
        ...createEventInput,
        createdBy: user,
      });

      return await this.eventsRepository.save(event);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.handleDbErrors(error);
    }
  }

  async findAll(eventType: EventType): Promise<Event[]> {
    try {
      return await this.eventsRepository.find({
        where: eventType ? { type: eventType } : {},
        relations: ['createdBy', 'invitations'],
      });
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAllByUser(user: User, eventType: EventType): Promise<Event[]> {
    try {
      return await this.eventsRepository.find({
        where: { createdBy: user, ...(eventType && { type: eventType }) },
        relations: ['createdBy', 'invitations'],
      });
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findOne(id: string): Promise<Event> {
    try {
      const event = await this.eventsRepository.findOne({
        where: { id },
        relations: ['createdBy', 'invitations'],
      });

      if (!event) {
        throw new BadRequestException('Event not found');
      }

      return event;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.handleDbErrors(error);
    }
  }

  async update(id: string, updateEventInput: UpdateEventInput): Promise<Event> {
    try {
      const updatedEvent = await this.eventsRepository.preload({
        id: id,
        ...updateEventInput,
      });

      if (!updatedEvent) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }

      const event = await this.eventsRepository.save(updatedEvent);
      return await this.eventsRepository.findOne({
        where: { id: event.id },
        relations: ['createdBy', 'invitations'],
      });
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please, check server logs');
  }
}
