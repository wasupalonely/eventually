import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateInvitationInput {
  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @Field(() => String)
  @IsUUID()
  @IsNotEmpty()
  guestId: string;
}
