import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from 'src/users/entities/user.entity';

export const GqlCurrentUser = createParamDecorator(
  (roles: ValidRoles[] = [], context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user: User = ctx.getContext().req.user;

    if (!user) {
      throw new InternalServerErrorException(
        'User not found in request context',
      );
    }

    if (roles.length === 0) return user;

    for (const role of user.roles) {
      // TODO: Eliminar el cast
      if (roles.includes(role as ValidRoles)) return user;
    }

    throw new ForbiddenException(
      `User ${user.fullName} need one of these roles: ${roles.join(', ')}`,
    );
  },
);
