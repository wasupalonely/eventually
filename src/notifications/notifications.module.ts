import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationsService } from './notifications.service';
import { SendgridService } from './sendgrid.service';
import { TwilioService } from './twilio.service';

@Module({
  providers: [NotificationsService, SendgridService, TwilioService],
  exports: [NotificationsService],
  imports: [ConfigModule],
})
export class NotificationsModule {}
