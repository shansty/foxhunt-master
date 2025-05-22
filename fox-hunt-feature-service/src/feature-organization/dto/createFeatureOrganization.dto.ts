import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { FeatureEntity } from 'src/feature/repository/feature.entity';

export class CreateFeatureOrganizationDto {
  @ApiProperty()
  @IsNotEmpty()
  organizationEntity: number;

  @ApiProperty()
  @IsNotEmpty()
  featureEntity: FeatureEntity;

  @ApiProperty()
  @IsNotEmpty()
  isEnabled: boolean;
}

export class ArrayFeatureOrganizationDto {
  @IsDefined()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFeatureOrganizationDto)
  featureOrganizationEntities: CreateFeatureOrganizationDto[];
}
