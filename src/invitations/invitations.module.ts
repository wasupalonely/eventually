import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationsService } from './invitations.service';
import { InvitationsResolver } from './invitations.resolver';
import { Invitation } from './entities/invitation.entity';
import { GuestsModule } from 'src/guests/guests.module';
import { EventsModule } from 'src/events/events.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invitation]),
    GuestsModule,
    EventsModule,
    NotificationsModule,
  ],
  providers: [InvitationsResolver, InvitationsService],
})
export class InvitationsModule {}
