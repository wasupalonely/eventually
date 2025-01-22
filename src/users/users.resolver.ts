import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/inputs';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { GqlAuthGuard } from 'src/shared/guards/gql-auth.guard';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { GqlCurrentUser } from 'src/shared/decorators/gql-current-user.decorator';

@Resolver(() => User)
@UseGuards(GqlAuthGuard)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @GqlCurrentUser([ValidRoles.admin]) _: User,
    @Args() validRoles: ValidRolesArgs,
  ) {
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.usersService.findOneById(id);
  }

  @Mutation(() => User, { name: 'updateUser' })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @GqlCurrentUser([ValidRoles.admin]) _: User,
    @Args('id', { type: () => ID }) id: string,
  ) {
    return this.usersService.block(id);
  }
}
