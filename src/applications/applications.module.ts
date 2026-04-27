import { Module } from '@nestjs/common';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { MockSimulationAdapter } from './adapters/mock-simulation.adapter';
import {
  APPLICATIONS_REPOSITORY,
  EVENTS_REPOSITORY,
  SIMULATION_PORT,
} from './tokens';
import { InMemoryApplicationsRepository } from './repositories/in-memory-applications.repository';
import { InMemoryEventsRepository } from './repositories/in-memory-events.repository';

@Module({
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    InMemoryApplicationsRepository,
    InMemoryEventsRepository,
    MockSimulationAdapter,
    {
      provide: APPLICATIONS_REPOSITORY,
      useExisting: InMemoryApplicationsRepository,
    },
    {
      provide: EVENTS_REPOSITORY,
      useExisting: InMemoryEventsRepository,
    },
    {
      provide: SIMULATION_PORT,
      useExisting: MockSimulationAdapter,
    },
  ],
})
export class ApplicationsModule {}
