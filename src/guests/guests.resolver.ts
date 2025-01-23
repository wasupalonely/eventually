import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { GuestsService } from './guests.service';
import { Guest } from './entities/guest.entity';
import { CreateGuestInput } from './dto/create-guest.input';
import { UpdateGuestInput } from './dto/update-guest.input';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-auth.guard';
import { GqlCurrentUser } from 'src/shared/decorators/gql-current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';

@Resolver(() => Guest)
@UseGuards(GqlAuthGuard)
export class GuestsResolver {
  constructor(private readonly guestsService: GuestsService) {}

  @Mutation(() => Guest)
  createGuest(
    @Args('createGuestInput') createGuestInput: CreateGuestInput,
    @GqlCurrentUser() user: User,
  ): Promise<Guest> {
    return this.guestsService.create(createGuestInput, user);
  }

  @Query(() => [Guest], { name: 'guests' })
  findAll(@GqlCurrentUser([ValidRoles.admin]) _: User) {
    return this.guestsService.findAll();
  }

  @Query(() => [Guest], { name: 'myGuests' })
  findAllByUser(@GqlCurrentUser() user: User) {
    return this.guestsService.findAllByUser(user);
  }

  @Query(() => Guest, { name: 'guest' })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.guestsService.findOne(id);
  }

  @Mutation(() => Guest)
  updateGuest(@Args('updateGuestInput') updateGuestInput: UpdateGuestInput) {
    return this.guestsService.update(updateGuestInput.id, updateGuestInput);
  }

  @Mutation(() => Guest)
  removeGuest(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.guestsService.remove(id);
  }
}
