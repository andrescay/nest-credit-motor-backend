import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApplicationStatus } from '../domain/application-status.enum';
import { ApplicationChannel } from '../domain/application-channel.enum';

export class ListApplicationsQueryDto {
  @ApiPropertyOptional({ enum: ApplicationStatus })
  @IsOptional()
  @IsString()
  status?: ApplicationStatus;

  @ApiPropertyOptional({ enum: ApplicationChannel })
  @IsOptional()
  @IsString()
  channel?: ApplicationChannel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerDocument?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  createdFrom?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDateString()
  createdTo?: string;
}
