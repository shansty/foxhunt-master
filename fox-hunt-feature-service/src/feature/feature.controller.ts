import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role } from 'src/auth/rolesAuth/enums/role.enum';
import { Roles } from 'src/auth/rolesAuth/roles.decorator';
import { SortDataDto } from 'src/feature/dto/sortDataDto';
import { PageSizeDto } from 'src/common/dto/pageSize.dto';
import { FeatureEntity } from 'src/feature/repository/feature.entity';
import { FeatureDescriptionDto } from './dto/updateFeatureDescription.dto';
import { FeatureService } from './feature.service';

@ApiTags('Feature')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('features')
export class FeatureController {
  constructor(private featureService: FeatureService) {}

  @Get()
  @Roles(Role.SystemAdmin)
  getAll(
    @Query() query?: PageSizeDto,
    @Query('name') name?: string,
    @Query() sort?: SortDataDto,
  ): Promise<FeatureEntity[]> {
    try {
      return this.featureService.getAll(
        sort.sort,
        name,
        query.page,
        query.size,
      );
    } catch (err) {
      if (err instanceof HttpException) throw err;
      throw new BadRequestException(err);
    }
  }

  @Patch(':id')
  @Roles(Role.SystemAdmin)
  async setNewDescription(
    @Param('id', ParseIntPipe) id: number,
    @Body() feature: FeatureDescriptionDto,
  ): Promise<FeatureEntity> {
    const updatedFeature = await this.featureService.update(id, feature);
    if (!updatedFeature) {
      throw new NotFoundException(`Organization with id: ${id} doesn't exist`);
    }
    return updatedFeature;
  }
}
