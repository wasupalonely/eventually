import { IsUUID } from 'class-validator';
import { CreateInvitationInput } from './create-invitation.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateInvitationInput extends PartialType(CreateInvitationInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
