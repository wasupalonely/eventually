import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { GuestsModule } from './guests/guests.module';
import { InvitationsModule } from './invitations/invitations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  providers: [],
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // debug: false,
      playground: false,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: true,
      autoLoadEntities: true,
    }),

    EventsModule,
    AuthModule,
    UsersModule,
    GuestsModule,
    InvitationsModule,
    NotificationsModule,
    CloudinaryModule,
    StatisticsModule,
  ],
  controllers: [],
})
export class AppModule {}
