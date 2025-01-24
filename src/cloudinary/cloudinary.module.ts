import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryConfig } from 'src/config/cloudinary.config';

@Module({
  exports: [CloudinaryConfig],
  providers: [CloudinaryConfig],
  imports: [ConfigModule],
})
export class CloudinaryModule {}
