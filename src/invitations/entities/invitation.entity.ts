import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Event } from 'src/events/entities/event.entity';
import { Guest } from 'src/guests/entities/guest.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { InvitationStatus } from '../enums/invitation-status.enum';

@ObjectType()
@Entity('invitations')
export class Invitation {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => Event)
  @ManyToOne(() => Event, (event) => event.invitations, {
    onDelete: 'CASCADE',
    eager: true,
  })
  event: Event;

  @Field(() => Guest)
  @ManyToOne(() => Guest, (guest) => guest.invitations, {
    onDelete: 'CASCADE',
    eager: true,
  })
  guest: Guest;

  @Field(() => InvitationStatus, { defaultValue: InvitationStatus.PENDING })
  @Column({ default: InvitationStatus.PENDING })
  invitationStatus: InvitationStatus;

  @Field(() => Date, { nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  expirationDate?: Date;

  @Field(() => String)
  @Column()
  qrCodeUrl: string;

  @Field(() => String)
  @Column()
  confirmationUrl: string;

  @Field(() => Date)
  @CreateDateColumn()
  createdAt: Date;
}
