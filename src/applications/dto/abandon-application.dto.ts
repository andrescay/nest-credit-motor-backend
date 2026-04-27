import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AbandonApplicationDto {
  @ApiProperty()
  @IsString()
  @Length(5, 300)
  reason!: string;
}
