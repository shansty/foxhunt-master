import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Head,
  UseInterceptors,
} from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationDto } from './dto/organization.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateOrganizationDto } from './dto/updateOrganization.dto';
import { Roles } from '../auth/rolesAuth/roles.decorator';
import { Role } from '../auth/rolesAuth/enums/role.enum';
import {
  ExistingOrganizationResponse,
  OrganizationResponse,
} from './interfaces/interfaces';
import { ActivateOrganizationDto } from './dto/activateOrganization.dto';
import { OrganizationEntity } from '../common/entities/organization.entity';
import { Payload, PayloadEntrails } from '../auth/rolesAuth/payload.decorator';
import { ChangeStatusOfOrganizationDto } from './dto/changeStatusOfOrganization.dto';
import { PageSizeDto } from '../common/dto/pageSize.dto';
import { SortDataDto } from '../common/dto/sortData.dto';
import { IUserFeedback } from 'src/common/interfaces/user-feedback.interface';

@ApiTags('Organizations')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('organizations')
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  @Roles(Role.SystemAdmin)
  getAll(
    @Query(
      'id',
      new ParseArrayPipe({ items: Number, separator: ',', optional: true }),
    )
    ids?: number[],
    @Query() query?: PageSizeDto,
    @Query('name') name?: string,
    @Query() sort?: SortDataDto,
  ): Promise<OrganizationEntity[]> {
    try {
      return this.organizationService.getAll(
        sort.sort,
        name,
        query.page,
        query.size,
        ids,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Get('system')
  @Roles(Role.SystemAdmin)
  getSystemOrganization(): Promise<OrganizationEntity> {
    try {
      return this.organizationService.getSystemOrganization();
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Get('/current')
  @Roles(Role.Any)
  async currentOrganization(
    @Payload() payload: PayloadEntrails,
  ): Promise<OrganizationResponse> {
    try {
      return await this.organizationService.findById(+payload.organizationId);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Get(':id')
  @Roles(Role.SystemAdmin)
  async getOrganizationById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrganizationResponse> {
    try {
      return await this.organizationService.findById(id);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Head('/domain/:orgDomain')
  async organizationExists(@Param('orgDomain') domain: string): Promise<void> {
    try {
      const organization = await this.organizationService.getByDomain(domain);
      if (!organization) throw new BadRequestException();
      return;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Get('/domain/:orgDomain')
  @Roles(Role.SystemAdmin)
  async getOrganizationIdByDomain(
    @Param('orgDomain') domain: string,
  ): Promise<ExistingOrganizationResponse> {
    try {
      const organization = await this.organizationService.getByDomain(domain);
      if (!organization) throw new BadRequestException();
      return organization;
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Post()
  @Roles(Role.SystemAdmin)
  async createOrganization(
    @Body() organization: OrganizationDto,
  ): Promise<void> {
    try {
      return await this.organizationService.createOrganization(organization);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Patch(':id')
  @Roles(Role.SystemAdmin)
  async patchOrganization(
    @Param('id') id: string,
    @Body() organization: UpdateOrganizationDto,
  ): Promise<OrganizationEntity[]> {
    try {
      return await this.organizationService.updateOrganization(
        id,
        organization,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Get(':id/user-feedback')
  @Roles(Role.SystemAdmin)
  async getUserFeedbacksByOrganizationId(
    @Param('id', ParseIntPipe) id: number,
    @Query('page', ParseIntPipe) page: number,
    @Query('size', ParseIntPipe) size: number,
  ): Promise<{
    content: IUserFeedback[];
    totalElements: number;
  }> {
    try {
      return await this.organizationService.getUserFeedbacks(id, page, size);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Put(':id/activation')
  @Roles(Role.SystemAdmin)
  async updateInitialOrganizationStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() organization: ActivateOrganizationDto,
  ): Promise<OrganizationEntity> {
    try {
      return await this.organizationService.updateInitialOrganizationStatus(
        id,
        organization,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Put(':id/status')
  @Roles(Role.SystemAdmin)
  async updateOrganizationStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() changeStatusDto: ChangeStatusOfOrganizationDto,
  ): Promise<OrganizationEntity> {
    try {
      return await this.organizationService.updateOrganizationStatus(
        id,
        changeStatusDto.status,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }
}
