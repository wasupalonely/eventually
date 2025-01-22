import { Module } from '@nestjs/common';
import { GuestsService } from './guests.service';
import { GuestsResolver } from './guests.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from './entities/guest.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest])],
  providers: [GuestsResolver, GuestsService],
  exports: [GuestsService],
})
export class GuestsModule {}
