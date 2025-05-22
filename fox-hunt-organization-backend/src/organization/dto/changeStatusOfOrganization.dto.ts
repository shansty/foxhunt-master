import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { OrganizationStatusEnum } from '../../common/enums/OrganizationStatus.enum';

export class ChangeStatusOfOrganizationDto {
  @ApiProperty()
  @IsNotEmpty()
  status: OrganizationStatusEnum;
}
