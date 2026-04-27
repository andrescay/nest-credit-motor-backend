import { ApplicationStatus } from './application-status.enum';

export interface Application {
  id: string;
  customerDocument: string;
  customerName: string;
  customerEmail?: string;
  channel: string;
  product: string;
  requestedAmount: number;
  requestedTermMonths: number;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  lastSimulation?: {
    outcome: 'AVAILABLE' | 'NOT_VIABLE' | 'TECHNICAL_ERROR';
    detail: string;
    suggestedAmount?: number;
    suggestRate?: number;
    simulatedAt: Date;
  };
  abandonmentReason?: string;
}
