import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { InvitationsService } from './invitations.service';
import { Invitation } from './entities/invitation.entity';
import {
  CreateInvitationInput,
  SendInvitationInput,
  SendInvitationsResponse,
  UpdateInvitationInput,
} from './dto/inputs';
import { GqlAuthGuard } from 'src/shared/guards/gql-auth.guard';
import { AcceptDeclineInvitationInput } from './dto/inputs/accept-decline-invitation.input';

@Resolver(() => Invitation)
@UseGuards(GqlAuthGuard)
export class InvitationsResolver {
  constructor(private readonly invitationsService: InvitationsService) {}

  @Mutation(() => Invitation, { name: 'createInvitation' })
  createInvitation(
    @Args('createInvitationInput') createInvitationInput: CreateInvitationInput,
  ) {
    return this.invitationsService.create(createInvitationInput);
  }

  @Mutation(() => SendInvitationsResponse, { name: 'sendInvitations' })
  async sendInvitations(
    @Args('sendInvitationInput') sendInvitationInput: SendInvitationInput,
  ): Promise<SendInvitationsResponse> {
    return this.invitationsService.sendInvitations(sendInvitationInput);
  }

  @Mutation(() => Invitation, { name: 'acceptOrDeclineInvitation' })
  async acceptOrDeclineInvitation(
    @Args('acceptDeclineInvitationInput')
    acceptDeclineInvitationInput: AcceptDeclineInvitationInput,
  ) {
    return this.invitationsService.acceptOrDeclineInvitation(
      acceptDeclineInvitationInput,
    );
  }

  @Query(() => [Invitation], { name: 'invitations' })
  findAll(
    @Args('id', { type: () => ID, nullable: true })
    eventId?: string,
  ) {
    return this.invitationsService.findAll(eventId);
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
