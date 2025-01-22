import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsResolver } from './invitations.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invitation } from './entities/invitation.entity';
import { GuestsModule } from 'src/guests/guests.module';

@Module({
  imports: [TypeOrmModule.forFeature([Invitation]), GuestsModule],
  providers: [InvitationsResolver, InvitationsService],
})
export class InvitationsModule {}
