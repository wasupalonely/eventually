import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { InvitationsService } from './invitations.service';
import { Invitation } from './entities/invitation.entity';
import { CreateInvitationInput, UpdateInvitationInput } from './dto/inputs';

@Resolver(() => Invitation)
export class InvitationsResolver {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Mutation(() => Invitation)
  createInvitation(
    @Args('createInvitationInput') createInvitationInput: CreateInvitationInput,
  ) {
    return this.invitationsService.create(createInvitationInput);
  }

  @Mutation(() => Invitation)
  addGuestToInvitation(
    @Args('guestsId', { type: () => [ID] }) guestsId: string[],
  ) {
    return 'This action adds a new guest to an invitation';
  }

  @Query(() => [Invitation], { name: 'invitations' })
  findAll() {
    return this.invitationsService.findAll();
  }

  @Query(() => Invitation, { name: 'invitation' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.invitationsService.findOne(id);
  }

  @Mutation(() => Invitation)
  updateInvitation(
    @Args('updateInvitationInput') updateInvitationInput: UpdateInvitationInput,
  ) {
    return this.invitationsService.update(
      updateInvitationInput.id,
      updateInvitationInput,
    );
  }

  @Mutation(() => Invitation)
  removeInvitation(@Args('id', { type: () => ID }) id: string) {
    return this.invitationsService.remove(id);
  }
}
