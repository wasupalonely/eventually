import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { ValidRoles } from '../enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

export const CurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: User = request.user;

    if (roles.length === 0) return user;

    for (const role of user.roles) {
      if (roles.includes(role as ValidRoles)) return user;
    }

    throw new ForbiddenException(
      `User ${user.fullName} need one of these roles: ${roles.join(', ')}`,
    );
  },
);
