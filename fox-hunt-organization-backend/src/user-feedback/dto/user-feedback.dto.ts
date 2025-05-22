import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrganizationEntity } from '../../common/entities/organization.entity';

export class UserFeedbackDto {
  @ApiProperty()
  @IsNotEmpty()
  userFeedbackId: number;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty()
  @IsNotEmpty()
  hasRead: boolean;

  @ApiProperty()
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  ranking: number;

  @ApiProperty()
  @IsISO8601()
  @IsNotEmpty()
  sendDate: string;

  @ApiProperty()
  @IsOptional()
  organizationEntity: OrganizationEntity;
}
