import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { SendWhatsAppMessageDto } from './dto';

@Injectable()
export class TwilioService {
  private client: twilio.Twilio;

  constructor(private configService: ConfigService) {
    this.client = twilio(
      this.configService.get('TWILIO_ACCOUNT_SID'),
      this.configService.get('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendWhatsApp({ to, body, qrCodeUrl }: SendWhatsAppMessageDto) {
    try {
      let mediaUrl: string | undefined;

      if (qrCodeUrl) {
        const uploadResult = await cloudinary.uploader.upload(qrCodeUrl, {
          folder: 'event_qrcodes',
          resource_type: 'image',
        });
        mediaUrl = uploadResult.secure_url;
      }

      const messageOptions = {
        body,
        from: `whatsapp:${this.configService.get('TWILIO_WHATSAPP_NUMBER')}`,
        to: `whatsapp:${to}`,
        mediaUrl: mediaUrl ? [mediaUrl] : undefined,
      };

      // Enviar el mensaje con Twilio
      return await this.client.messages.create(messageOptions);
    } catch (error) {
      throw new Error(`WhatsApp send error: ${error.message}`);
    }
  }
}
