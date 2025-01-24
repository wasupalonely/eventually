import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';
import { SendEmailMessageDto } from './dto';

@Injectable()
export class SendgridService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendEmail({ to, subject, html }: SendEmailMessageDto) {
    try {
      await sgMail.send({
        to,
        from: this.configService.get('SENDGRID_FROM_EMAIL'),
        subject,
        html,
      });
    } catch (error) {
      throw new Error(`Email send error: ${error.message}`);
    }
  }
}
