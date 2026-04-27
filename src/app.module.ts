import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationsModule } from './applications/applications.module';
import { InMemoryApplicationsRepository } from './applications/respositories/in-memory-applications.repository';
import { InMemoryEventsRepository } from './applications/respositories/in-memory-events.repository';
import { MockSimulationAdapter } from './applications/adapters/mock-simulation.adapter';
import {
  APPLICATIONS_REPOSITORY,
  EVENTS_REPOSITORY,
  SIMULATION_PORT,
} from './applications/tokens';

@Module({
  imports: [ApplicationsModule],
  controllers: [AppController],
  providers: [
    AppService,
    InMemoryApplicationsRepository,
    InMemoryEventsRepository,
    MockSimulationAdapter,
    {
      provide: APPLICATIONS_REPOSITORY,
      useClass: InMemoryApplicationsRepository,
    },
    {
      provide: EVENTS_REPOSITORY,
      useClass: InMemoryEventsRepository,
    },
    {
      provide: SIMULATION_PORT,
      useClass: MockSimulationAdapter,
    },
  ],
})
export class AppModule {}
