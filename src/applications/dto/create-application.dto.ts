import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty()
  @IsString()
  customerDocument!: string;

  @ApiProperty()
  @IsString()
  customerName!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiProperty()
  @IsString()
  channel!: string;

  @ApiProperty()
  @IsString()
  product!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  requestedAmount?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  requestedTermMonths?: number;
}
