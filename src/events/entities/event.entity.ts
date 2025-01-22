import { ObjectType, Field, ID } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { EventType } from '../enums/event-type.enum';
import { Invitation } from 'src/invitations/entities/invitation.entity';

@ObjectType()
@Entity({ name: 'events' })
export class Event {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String)
  @Column({ nullable: true })
  description: string;

  // TODO: Make compatible with google maps api so we can store the coordinates
  @Field(() => EventType)
  @Column({ type: 'enum', enum: EventType })
  type: EventType;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  location?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  url?: string;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  startDate: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp' })
  endDate: Date;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'createdBy' })
  createdBy: User;

  @Field(() => [Invitation])
  @OneToMany(() => Invitation, (invitation) => invitation.event)
  invitations: Invitation[];

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
