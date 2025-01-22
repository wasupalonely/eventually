import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { GuestsService } from './guests.service';
import { Guest } from './entities/guest.entity';
import { CreateGuestInput } from './dto/create-guest.input';
import { UpdateGuestInput } from './dto/update-guest.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-auth.guard';
import { GqlCurrentUser } from 'src/shared/decorators/gql-current-user.decorator';
import { User } from 'src/users/entities/user.entity';

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
  findAll() {
    return this.guestsService.findAll();
  }

  @Query(() => Guest, { name: 'guest' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.guestsService.findOne(id);
  }

  @Mutation(() => Guest)
  updateGuest(@Args('updateGuestInput') updateGuestInput: UpdateGuestInput) {
    return this.guestsService.update(updateGuestInput.id, updateGuestInput);
  }

  @Mutation(() => Guest)
  removeGuest(@Args('id', { type: () => Int }) id: number) {
    return this.guestsService.remove(id);
  }
}
