import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApplicationsService } from './applications.service';
import { AbandonApplicationDto } from './dto/abandon-application.dto';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ListApplicationsQueryDto } from './dto/list-applications.query.dtos';
import { UpdateApplicationDto } from './dto/update-application.dto';

@ApiTags('applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(
    @Body() body: CreateApplicationDto,
    @Headers('x-request-id') requestId?: string,
  ) {
    return this.applicationsService.create(body, requestId);
  }

  @Get()
  findAll(@Query() query: ListApplicationsQueryDto) {
    return this.applicationsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateApplicationDto,
    @Headers('x-request-id') requestId?: string,
  ) {
    return this.applicationsService.update(id, body, requestId);
  }

  @Post(':id/simulate-offer')
  simulateOffer(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    return this.applicationsService.simulateOffer(id, requestId);
  }

  @Post(':id/finalize')
  finalize(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Headers('x-request-id') requestId?: string,
  ) {
    return this.applicationsService.finalize(id, requestId);
  }

  @Post(':id/abandon')
  abandon(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: AbandonApplicationDto,
    @Headers('x-request-id') requestId?: string,
  ) {
    return this.applicationsService.abandon(id, body, requestId);
  }

  @Get(':id/events')
  events(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.applicationsService.events(id);
  }
}
