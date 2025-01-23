import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { ConfigService } from '@nestjs/config';
import { SendWhatsAppMessageDto } from './dto';
import { WhatsappMessageOptions } from './interfaces/whatsapp-message-options.interface';

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
      const messageOptions: WhatsappMessageOptions = {
        body,
        from: `whatsapp:${this.configService.get('TWILIO_WHATSAPP_NUMBER')}`,
        to: `whatsapp:${to}`,
      };

      if (qrCodeUrl) {
        messageOptions.mediaUrl = [qrCodeUrl];
      }

      return await this.client.messages.create(messageOptions);
    } catch (error) {
      throw new Error(`WhatsApp send error: ${error.message}`);
    }
  }
}
