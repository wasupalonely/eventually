import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class SendWhatsAppMessageDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+57[3][0-9]{9}$/, {
    message:
      'El número debe estar en formato colombiano: +57 seguido de 10 dígitos. Ejemplo: +573001234567',
  })
  to: string;

  @IsString()
  @IsNotEmpty()
  body: string;

  @IsString()
  @IsOptional()
  qrCodeUrl?: string;
}
