import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/rolesAuth/enums/role.enum';
import { Payload, PayloadEntrails } from 'src/auth/rolesAuth/payload.decorator';
import { Roles } from 'src/auth/rolesAuth/roles.decorator';
import { ArrayFeatureOrganizationDto } from './dto/createFeatureOrganization.dto';
import { FeatureOrganizationService } from './feature-organization.service';
import {
  FeatureOrganizationRelationsForCurrentOrgnaization,
  FeatureOrganizationResponse,
  UpdateFeatureOrganizationRelationsResponse,
} from './interfaces/featureOrganization.interface';

@ApiTags('FeatureOrganization')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('feature-organization')
export class FeatureOrganizationController {
  constructor(private featureOrganizationService: FeatureOrganizationService) {}

  @Get()
  @Roles(Role.SystemAdmin)
  async getAll(
    @Query() organizationFilter?: any,
  ): Promise<FeatureOrganizationResponse[]> {
    try {
      return await this.featureOrganizationService.getAll(organizationFilter);
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Get('/current')
  @Roles(Role.Any)
  async getByOrganizationId(
    @Payload() payload: PayloadEntrails,
  ): Promise<FeatureOrganizationRelationsForCurrentOrgnaization[]> {
    try {
      return await this.featureOrganizationService.getByOrganizationId(
        payload.organizationId,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Post()
  @Roles(Role.SystemAdmin)
  async createFeatureOrganizationRelations(
    @Body() featureOrganizationRelations: ArrayFeatureOrganizationDto,
  ): Promise<UpdateFeatureOrganizationRelationsResponse> {
    try {
      return await this.featureOrganizationService.createFeatureOrganizationRelations(
        featureOrganizationRelations.featureOrganizationEntities,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }
}
