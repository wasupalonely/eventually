import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateGuestInput } from './dto/create-guest.input';
import { UpdateGuestInput } from './dto/update-guest.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GuestsService {
  private logger = new Logger('GuestsService');
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  private createGuestBusinessLogicValidations(
    createGuestInput: CreateGuestInput | UpdateGuestInput,
  ): void {
    if (!createGuestInput.email && !createGuestInput.phoneNumber) {
      throw new BadRequestException(
        'Must provide either an email or a phone number for the guest',
      );
    }
  }

  async create(createGuestInput: CreateGuestInput, user: User): Promise<Guest> {
    try {
      this.createGuestBusinessLogicValidations(createGuestInput);

      const guest = this.guestRepository.create({
        ...createGuestInput,
        createdBy: user,
      });

      return await this.guestRepository.save(guest);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.handleDbErrors(error);
    }
  }

  async findAll() {
    try {
      return await this.guestRepository.find();
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAllByUser(user: User): Promise<Guest[]> {
    try {
      return await this.guestRepository.find({
        where: { createdBy: { id: user.id } },
        relations: ['createdBy', 'invitations'],
      });
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findByIds(ids: string[]): Promise<Guest[]> {
    return await this.guestRepository.findBy({ id: In(ids) });
  }

  async findOne(id: string) {
    const guest = await this.guestRepository.findOneBy({ id });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    return guest;
  }

  async update(id: string, updateGuestInput: UpdateGuestInput) {
    try {
      const updatedGuest = await this.guestRepository.preload({
        id: id,
        ...updateGuestInput,
      });

      if (!updatedGuest) {
        throw new NotFoundException(`Guest with ID ${id} not found`);
      }

      const event = await this.guestRepository.save(updatedGuest);
      return await this.guestRepository.findOne({
        where: { id: event.id },
        relations: ['createdBy', 'invitations'],
      });
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  remove(id: string) {
    return `This action removes a #${id} guest`;
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please, check server logs');
  }
}
