import { Test } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { MockSimulationAdapter } from './adapters/mock-simulation.adapter';
import { ApplicationStatus } from './domain/application-status.enum';

import {
  APPLICATIONS_REPOSITORY,
  EVENTS_REPOSITORY,
  SIMULATION_PORT,
} from './tokens';
import { InMemoryApplicationsRepository } from './repositories/in-memory-applications.repository';
import { InMemoryEventsRepository } from './repositories/in-memory-events.repository';

describe('ApplicationsService', () => {
  let service: ApplicationsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        InMemoryApplicationsRepository,
        InMemoryEventsRepository,
        MockSimulationAdapter,
        {
          provide: APPLICATIONS_REPOSITORY,
          useExisting: InMemoryApplicationsRepository,
        },
        { provide: EVENTS_REPOSITORY, useExisting: InMemoryEventsRepository },
        { provide: SIMULATION_PORT, useExisting: MockSimulationAdapter },
      ],
    }).compile();

    service = moduleRef.get(ApplicationsService);
  });

  it('crea solicitud en IN_PROGRESS', async () => {
    const app = await service.create({
      customerDocument: '1001',
      customerName: 'Ana Perez',
      channel: 'SELF_SERVICE',
      product: 'FREE_DESTINATION',
      requestedAmount: 20000,
      requestedTermMonths: 24,
    });
    expect(app.status).toBe(ApplicationStatus.IN_PROGRESS);
  });

  it('rechaza edición cuando está finalizada', async () => {
    const app = await service.create({
      customerDocument: '1002',
      customerName: 'Luis Ruiz',
      channel: 'ASSISTED',
      product: 'FREE_DESTINATION',
      requestedAmount: 30000,
      requestedTermMonths: 36,
    });
    await service.finalize(app.id);
    await expect(
      service.update(app.id, { customerName: 'Cambio' }),
    ).rejects.toBeDefined();
  });

  it('registra simulación técnica fallida', async () => {
    const app = await service.create({
      customerDocument: '12349',
      customerName: 'Tecnico Error',
      channel: 'SELF_SERVICE',
      product: 'FREE_DESTINATION',
    });
    const updated = await service.simulateOffer(app.id);
    expect(updated.lastSimulation?.outcome).toBe('TECHNICAL_ERROR');
  });
});
