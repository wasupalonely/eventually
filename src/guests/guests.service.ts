import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
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

  findAll() {
    return `This action returns all guests`;
  }

  async findByIds(ids: string[]): Promise<Guest[]> {
    return await this.guestRepository.findBy({ id: In(ids) });
  }

  findOne(id: number) {
    return `This action returns a #${id} guest`;
  }

  update(id: number, updateGuestInput: UpdateGuestInput) {
    return `This action updates a #${id} guest`;
  }

  remove(id: number) {
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
