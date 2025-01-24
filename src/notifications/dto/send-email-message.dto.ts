import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailMessageDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  to: string;

  @IsString()
  subject: string;

  @IsString()
  html: string;
}
