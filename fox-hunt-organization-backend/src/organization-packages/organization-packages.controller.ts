import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  Logger,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../auth/rolesAuth/enums/role.enum';
import { Roles } from '../auth/rolesAuth/roles.decorator';
import { PostOrDeleteOrganizationPackagesDto } from './dto/postOrDeleteOrganizationPackages.dto';
import { OrganizationPackagesInfo } from './interfaces/interfaces';
import { OrganizationPackagesService } from './organization-packages.service';

@ApiTags('LocationPackages')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('organization-packages')
export class OrganizationPackagesController {
  private readonly logger = new Logger(OrganizationPackagesController.name);
  constructor(
    private organizationPackagesService: OrganizationPackagesService,
  ) {}

  @Get()
  @Roles(Role.SystemAdmin)
  async getOrganizationPackages(): Promise<OrganizationPackagesInfo[]> {
    this.logger.verbose('Request to receive organization-packages');
    try {
      return await this.organizationPackagesService.getOrganizationPackages();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Patch()
  @Roles(Role.SystemAdmin)
  async manageOrganizationPackages(
    @Body() organizationPackages: PostOrDeleteOrganizationPackagesDto,
  ): Promise<void> {
    try {
      await this.organizationPackagesService.manageOrganizationPackages(
        organizationPackages,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }
}
