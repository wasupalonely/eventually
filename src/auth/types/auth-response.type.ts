import { User } from 'src/users/entities/user.entity';

export class AuthResponse {
  token: string;

  user: User;
}
