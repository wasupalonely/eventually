import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class SendInvitationsResponse {
  @Field(() => String)
  eventId: string;

  @Field(() => [String])
  notifiedGuests: string[];
}
