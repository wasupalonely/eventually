import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { AuthResponse } from './types/auth-response.type';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private getJWTToken(userId: string) {
    return this.jwtService.sign({ id: userId });
  }

  async signup(signupInput: SignupDto): Promise<AuthResponse> {
    const user = await this.usersService.create(signupInput);

    const token = this.getJWTToken(user.id);

    return { token, user };
  }

  async login({ email, password }: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findOneByEmail(email);

    if (!bcrypt.compareSync(password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.getJWTToken(user.id);
    return { user, token };
  }

  async validateUser(id: string): Promise<User> {
    const user = await this.usersService.findOneById(id);

    if (!user.isActive)
      throw new UnauthorizedException(
        'User is blocked, please contact an admin',
      );

    delete user.password;

    return user;
  }

  revalidateToken(user: User): AuthResponse {
    const token = this.getJWTToken(user.id);
    return { user, token };
  }
}
