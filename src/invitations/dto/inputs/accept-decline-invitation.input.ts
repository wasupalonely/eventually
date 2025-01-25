import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsString, IsUUID } from 'class-validator';
import { InvitationStatus } from 'src/invitations/enums/invitation-status.enum';

@InputType()
export class AcceptDeclineInvitationInput {
  @Field(() => String)
  @IsString()
  @IsUUID()
  guestId: string;

  @Field(() => String)
  @IsString()
  @IsUUID()
  eventId: string;

  @Field(() => InvitationStatus)
  @IsEnum(InvitationStatus)
  invitationStatus: InvitationStatus;
}
