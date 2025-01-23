import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendgridService {
  constructor(private configService: ConfigService) {
    sgMail.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendEmail(to: string, subject: string, html: string) {
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
