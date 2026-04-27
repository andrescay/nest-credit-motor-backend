import { ApplicationEventType } from './application-event-type.enum';

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  type: ApplicationEventType;
  ocurredAt: string;
  requestId?: string;
  payload?: Record<string, unknown>;
}
