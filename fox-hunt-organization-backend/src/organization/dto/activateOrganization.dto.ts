import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { UserRoles } from '../interfaces/interfaces';

export class ActivateOrganizationDto {
  @ApiProperty()
  @IsArray()
  roles: { userId: number; organizationId: number; role: UserRoles }[];
}
