import { Injectable } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { SendgridService } from './sendgrid.service';
import { SendEmailMessageDto, SendWhatsAppMessageDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(
    private twilioService: TwilioService,
    private sendgridService: SendgridService,
  ) {}

  async sendWhatsAppMessage(sendWhatsAppMessageDto: SendWhatsAppMessageDto) {
    return this.twilioService.sendWhatsApp(sendWhatsAppMessageDto);
  }

  async sendEmail(sendEmailMessageDto: SendEmailMessageDto) {
    return this.sendgridService.sendEmail(sendEmailMessageDto);
  }
}
