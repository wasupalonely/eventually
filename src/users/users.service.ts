/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/inputs';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { SignupDto } from 'src/auth/dto/signup.dto';

@Injectable()
export class UsersService {
  private logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(signupDto: SignupDto): Promise<User> {
    try {
      const user = this.userRepository.create({
        ...signupDto,
        password: bcrypt.hashSync(signupDto.password, 10),
      });

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async findAll(roles: ValidRoles[]): Promise<User[]> {
    if (roles.length === 0) return this.userRepository.find();

    return this.userRepository
      .createQueryBuilder('user')
      .andWhere('ARRAY[roles] && ARRAY[:...roles]')
      .setParameter('roles', roles)
      .getMany();
  }

  async findOneById(id: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ id });
    } catch (error) {
      throw new NotFoundException(`${id} not found`);
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneByOrFail({ email });
    } catch (error) {
      throw new NotFoundException(`${email} not found`);
    }
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    try {
      const user = await this.userRepository.preload({
        id,
        ...updateUserInput,
      });

      return await this.userRepository.save(user);
    } catch (error) {
      this.handleDbErrors(error);
    }
  }

  async block(id: string): Promise<User> {
    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = !userToBlock.isActive;

    return await this.userRepository.save(userToBlock);
  }

  private handleDbErrors(error: any): never {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail.replace('Key', ''));
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Please, check server logs');
  }
}
