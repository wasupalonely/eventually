import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Event } from 'src/events/entities/event.entity';
import { Guest } from 'src/guests/entities/guest.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity({ name: 'users' })
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => String)
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Field(() => [String])
  @Column({
    type: 'text',
    array: true,
    default: ['user'],
  })
  roles: string[];

  @Field(() => Boolean)
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Field(() => [Event], { defaultValue: [] })
  @OneToMany(() => Event, (event) => event.createdBy, { eager: true })
  eventsCreated: Event[];

  @Field(() => [Guest])
  @OneToMany(() => Guest, (guest) => guest.createdBy)
  guests: Guest[];

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
