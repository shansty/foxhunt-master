import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class FeatureDescriptionDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  isGlobalyEnabled?: boolean;
}
