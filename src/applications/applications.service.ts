import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DomainException } from '../common/errors/domain.exception';
import { ErrorCode } from '../common/errors/error-codes';
import { ApplicationEventType } from './domain/application-event-type.enum';
import { ApplicationStatus } from './domain/application-status.enum';
import { Application } from './domain/application.entity';
import {
  assertCanEdit,
  assertCanFinalize,
  assertTransition,
} from './domain/state-rules';
import { AbandonApplicationDto } from './dto/abandon-application.dto';
import { CreateApplicationDto } from './dto/create-application.dto';

import { UpdateApplicationDto } from './dto/update-application.dto';
import * as simulationPort from './ports/simulation.port';
import {
  APPLICATIONS_REPOSITORY,
  EVENTS_REPOSITORY,
  SIMULATION_PORT,
} from './tokens';
import type { ApplicationsRepository } from './repositories/applications.repository';
import type { EventsRepository } from './repositories/events.repository';
import type { SimulationPort } from './ports/simulation.port';
import { ListApplicationsQueryDto } from './dto/list-applications.query.dtos';

@Injectable()
export class ApplicationsService {
  constructor(
    @Inject(APPLICATIONS_REPOSITORY)
    private readonly applicationsRepository: ApplicationsRepository,
    @Inject(EVENTS_REPOSITORY)
    private readonly eventsRepository: EventsRepository,
    @Inject(SIMULATION_PORT)
    private readonly simulationPort: SimulationPort,
  ) {}

  async create(
    input: CreateApplicationDto,
    requestId?: string,
  ): Promise<Application> {
    const now = new Date();
    const entity: Application = {
      ...input,
      id: randomUUID(),
      status: ApplicationStatus.IN_PROGRESS,
      createdAt: now,
      updatedAt: now,
      requestedAmount: input.requestedAmount ?? 0,
      requestedTermMonths: input.requestedTermMonths ?? 0,
    };
    const created = await this.applicationsRepository.create(entity);
    await this.createEvent(
      created.id,
      ApplicationEventType.APPLICATION_CREATED,
      requestId,
      {
        status: created.status,
        channel: created.channel,
      },
    );
    return created;
  }

  async findAll(filters: ListApplicationsQueryDto): Promise<Application[]> {
    return this.applicationsRepository.findAll(filters);
  }

  async findOne(id: string): Promise<Application> {
    const app = await this.applicationsRepository.findById(id);
    if (!app) {
      throw new DomainException(
        HttpStatus.NOT_FOUND,
        ErrorCode.APPLICATION_NOT_FOUND,
        `Application ${id} not found`,
      );
    }
    return app;
  }

  async update(
    id: string,
    input: UpdateApplicationDto,
    requestId?: string,
  ): Promise<Application> {
    const app = await this.findOne(id);
    assertCanEdit(app.status);
    const updated: Application = {
      ...app,
      ...input,
      updatedAt: new Date(),
    };
    await this.applicationsRepository.update(updated);
    await this.createEvent(
      id,
      ApplicationEventType.APPLICATION_UPDATED,
      requestId,
      {
        updatedFields: Object.keys(input),
      },
    );
    return updated;
  }

  async simulateOffer(id: string, requestId?: string): Promise<Application> {
    const app = await this.findOne(id);
    assertCanEdit(app.status);
    const result = await this.simulationPort.simulateOffer({
      customerDocument: app.customerDocument,
      requestedAmount: app.requestedAmount,
    });

    const updated: Application = {
      ...app,
      lastSimulation: {
        ...result,
        simulatedAt: new Date(),
      },
      updatedAt: new Date(),
    };
    await this.applicationsRepository.update(updated);

    const eventType =
      result.outcome === 'AVAILABLE'
        ? ApplicationEventType.OFFER_SIMULATION_SUCCEEDED
        : result.outcome === 'NOT_VIABLE'
          ? ApplicationEventType.OFFER_SIMULATION_NOT_VIABLE
          : ApplicationEventType.OFFER_SIMULATION_TECHNICAL_ERROR;
    await this.createEvent(
      id,
      eventType,
      requestId,
      result as unknown as Record<string, unknown>,
    );
    return updated;
  }

  async finalize(id: string, requestId?: string): Promise<Application> {
    const app = await this.findOne(id);
    assertCanFinalize(app);
    assertTransition(app.status, ApplicationStatus.FINALIZED);
    const updated: Application = {
      ...app,
      status: ApplicationStatus.FINALIZED,
      updatedAt: new Date(),
    };
    await this.applicationsRepository.update(updated);
    await this.createEvent(
      id,
      ApplicationEventType.APPLICATION_FINALIZED,
      requestId,
      undefined,
    );
    await this.createEvent(id, ApplicationEventType.STATUS_CHANGED, requestId, {
      from: app.status,
      to: updated.status,
    });
    return updated;
  }

  async abandon(
    id: string,
    input: AbandonApplicationDto,
    requestId?: string,
  ): Promise<Application> {
    const app = await this.findOne(id);
    assertTransition(app.status, ApplicationStatus.ABANDONED);
    const updated: Application = {
      ...app,
      status: ApplicationStatus.ABANDONED,
      abandonmentReason: input.reason,
      updatedAt: new Date(),
    };
    await this.applicationsRepository.update(updated);
    await this.createEvent(
      id,
      ApplicationEventType.APPLICATION_ABANDONED,
      requestId,
      {
        reason: input.reason,
      },
    );
    await this.createEvent(id, ApplicationEventType.STATUS_CHANGED, requestId, {
      from: app.status,
      to: updated.status,
    });
    return updated;
  }

  async events(applicationId: string) {
    await this.findOne(applicationId);
    return this.eventsRepository.findByApplicationId(applicationId);
  }

  private async createEvent(
    applicationId: string,
    type: ApplicationEventType,
    requestId?: string,
    payload?: Record<string, unknown>,
  ) {
    await this.eventsRepository.create({
      id: randomUUID(),
      applicationId,
      type,
      requestId,
      occurredAt: new Date().toISOString(),
      payload,
    });
  }
}
