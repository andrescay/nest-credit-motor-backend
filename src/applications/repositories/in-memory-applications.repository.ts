import { Injectable } from '@nestjs/common';
import { Application } from '../domain/application.entity';
import { ApplicationsRepository } from './applications.repository';
import { ListApplicationsQueryDto } from '../dto/list-applications.query.dtos';

@Injectable()
export class InMemoryApplicationsRepository implements ApplicationsRepository {
  private readonly applications = new Map<string, Application>();

  async create(application: Application): Promise<Application> {
    this.applications.set(application.id, application);
    return application;
  }

  async update(application: Application): Promise<Application> {
    this.applications.set(application.id, application);
    return application;
  }

  async findById(id: string): Promise<Application | null> {
    return this.applications.get(id) ?? null;
  }

  async findAll(filters: ListApplicationsQueryDto): Promise<Application[]> {
    return [...this.applications.values()].filter((app) => {
      if (filters.status && app.status !== filters.status) {
        return false;
      }
      if (filters.channel && app.channel !== filters.channel) {
        return false;
      }
      if (
        filters.customerDocument &&
        app.customerDocument !== filters.customerDocument
      ) {
        return false;
      }
      if (
        filters.createdFrom &&
        app.createdAt < new Date(filters.createdFrom)
      ) {
        return false;
      }
      if (filters.createdTo && app.createdAt > new Date(filters.createdTo)) {
        return false;
      }
      return true;
    });
  }
}
