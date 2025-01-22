import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { EventsService } from './events.service';
import { Event } from './entities/event.entity';
import { CreateEventInput, UpdateEventInput } from './dto/inputs';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/shared/guards/gql-auth.guard';
import { GqlCurrentUser } from 'src/shared/decorators/gql-current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { EventType } from './enums/event-type.enum';

@Resolver(() => Event)
@UseGuards(GqlAuthGuard)
export class EventsResolver {
  constructor(private readonly eventsService: EventsService) {}

  @Mutation(() => Event)
  createEvent(
    @Args('createEventInput') createEventInput: CreateEventInput,
    @GqlCurrentUser() currentUser: User,
  ) {
    return this.eventsService.create(createEventInput, currentUser);
  }

  @Query(() => [Event], { name: 'events' })
  findAll(
    @GqlCurrentUser([ValidRoles.admin]) _: User,
    @Args('eventType', { type: () => EventType, nullable: true })
    eventType?: EventType,
  ) {
    return this.eventsService.findAll(eventType);
  }

  @Query(() => [Event], { name: 'eventsByUser' })
  findAllByUser(
    @GqlCurrentUser() currentUser: User,
    @Args('eventType', { type: () => EventType, nullable: true })
    eventType?: EventType,
  ) {
    return this.eventsService.findAllByUser(currentUser, eventType);
  }

  @Query(() => Event, { name: 'event' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.eventsService.findOne(id);
  }

  @Mutation(() => Event)
  updateEvent(@Args('updateEventInput') updateEventInput: UpdateEventInput) {
    return this.eventsService.update(updateEventInput.id, updateEventInput);
  }
}
