import { OmitType, PartialType } from '@nestjs/swagger';
import { OrganizationDto } from './organization.dto';

export class UpdateOrganizationDto extends PartialType(
  OmitType(OrganizationDto, ['organizationDomain']),
) {}
