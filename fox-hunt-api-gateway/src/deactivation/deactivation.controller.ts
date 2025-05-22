import {
  BadRequestException,
  Controller,
  HttpException,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { DeactivationService } from './deactivation.service';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/auth/rolesAuth/roles.decorator';
import { Role } from '../common/auth/rolesAuth/enums/role.enum';

@ApiTags('Deactivation')
@Controller()
export class DeactivationController {
  constructor(private deactivationService: DeactivationService) {}

  @Roles(Role.SystemAdmin)
  @Post('/deactivation/organization/:id')
  async deactivateOrganization(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      return await this.deactivationService.deactivateOrganization(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Roles(Role.SystemAdmin)
  @Post('/activation/organization/:id')
  async activateOrganization(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    try {
      return await this.deactivationService.activateOrganization(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }
}
