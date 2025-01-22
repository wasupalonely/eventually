import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

@InputType()
export class CreateGuestInput {
  @Field(() => String, { description: 'Name of the guest' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field(() => String, { nullable: true })
  @IsEmail()
  @IsOptional()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @Matches(/^\+57[3][0-9]{9}$/, {
    message:
      'El número debe estar en formato colombiano: +57 seguido de 10 dígitos. Ejemplo: +573001234567',
  })
  phoneNumber?: string;
}
