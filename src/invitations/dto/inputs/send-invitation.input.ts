import { Field, InputType } from '@nestjs/graphql';
import { IsArray, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class SendInvitationInput {
  @Field(() => [String], {
    description:
      'Guest IDs to send invitations (If is not sent will sen d invitation to every person invitated in that event)',
    nullable: true,
  })
  @IsArray()
  @IsOptional()
  guestIds?: string[];

  @Field(() => String, { description: 'Event ID' })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}
