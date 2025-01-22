import { InputType, Field } from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { EventType } from 'src/events/enums/event-type.enum';

@InputType()
export class CreateEventInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MaxLength(255)
  @MinLength(3)
  @IsOptional()
  description?: string;

  @Field(() => EventType)
  @IsNotEmpty()
  @IsEnum(EventType)
  type: EventType;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  location?: string;

  @Field(() => String, { nullable: true })
  @IsUrl()
  @IsOptional()
  url?: string;

  @Field(() => Date)
  @IsDate()
  startDate: Date;

  @Field(() => Date)
  @IsDate()
  endDate: Date;
}
