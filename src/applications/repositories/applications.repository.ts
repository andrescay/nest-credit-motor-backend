import { Application } from '../domain/application.entity';
import { ListApplicationsQueryDto } from '../dto/list-applications.query.dtos';

export interface ApplicationsRepository {
  create(application: Application): Promise<Application>;
  update(application: Application): Promise<Application>;
  findById(id: string): Promise<Application | null>;
  findAll(filters: ListApplicationsQueryDto): Promise<Application[]>;
}
