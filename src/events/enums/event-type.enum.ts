import { registerEnumType } from '@nestjs/graphql';

export enum EventType {
  VIRTUAL = 'virtual',
  IN_PERSON = 'in_person',
  HYBRID = 'hybrid',
}

registerEnumType(EventType, { name: 'EventType' });
