import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class OrganizationPackage {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locationPackageId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  organizationId: string;
}

export class PostOrDeleteOrganizationPackagesDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrganizationPackage)
  assignments: OrganizationPackage[];

  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrganizationPackage)
  unassignments: OrganizationPackage[];
}
