import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Invitation } from 'src/invitations/entities/invitation.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'guests' })
export class Guest {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  name: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  phoneNumber?: string;

  @Field(() => [Invitation])
  @OneToMany(() => Invitation, (invitation) => invitation.guest)
  invitations: Invitation[];

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.guests, { onDelete: 'CASCADE' })
  createdBy: User;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
