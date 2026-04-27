import { Injectable } from '@nestjs/common';
import { ApplicationEvent } from '../domain/application-event.entity';
import { EventsRepository } from './events.repository';

@Injectable()
export class InMemoryEventsRepository implements EventsRepository {
  private readonly events = new Map<string, ApplicationEvent[]>();

  async create(event: ApplicationEvent): Promise<ApplicationEvent> {
    const list = this.events.get(event.applicationId) ?? [];
    list.push(event);
    this.events.set(event.applicationId, list);
    return event;
  }

  async findByApplicationId(
    applicationId: string,
  ): Promise<ApplicationEvent[]> {
    return this.events.get(applicationId) ?? [];
  }
}
