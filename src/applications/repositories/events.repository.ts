import { ApplicationEvent } from '../domain/application-event.entity';

export interface EventsRepository {
  create(event: ApplicationEvent): Promise<ApplicationEvent>;
  findByApplicationId(applicationId: string): Promise<ApplicationEvent[]>;
}
