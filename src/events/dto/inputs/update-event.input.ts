import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateEventInput } from './create-event.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdateEventInput extends PartialType(CreateEventInput) {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
