import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { OrganizationTypeEnum } from '../../common/enums/OrganizationType.enum';
import { Transform, Type } from 'class-transformer';

export class OrganizationDto {
  @ApiProperty({ required: false })
  @Allow()
  actualAddress?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  approximateEmployeesAmount?: number;

  @ApiProperty()
  @IsNotEmpty()
  legalAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Transform(({ value }) => value.toLowerCase())
  organizationDomain: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  rootUserEmail: string;

  @ApiProperty()
  @IsNotEmpty()
  type: OrganizationTypeEnum;
}
