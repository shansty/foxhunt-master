import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { FeatureRepository } from 'src/feature/repository/feature.repository';
import { FeatureEntity } from 'src/feature/repository/feature.entity';
import { FeatureDescriptionDto } from './dto/updateFeatureDescription.dto';
import { Sort } from './enums/Sort.enum';
import { Order } from './enums/Order.enum';
import { ISortData } from './interfaces/sortData.interface';

@Injectable()
export class FeatureService {
  private readonly logger = new Logger(FeatureService.name);
  constructor(private featureRepository: FeatureRepository) {}

  public async getAll(
    sort: ISortData = [Sort.ID, Order.ASC],
    name = '',
    page = 0,
    size?: number | undefined,
  ): Promise<FeatureEntity[]> {
    this.logger.log(`Request to get features with descriptions`);
    let features: FeatureEntity[];

    if (page !== 0 && !size)
      throw new BadRequestException('Size need to be specified with page');

    if (page === 0 && !size) {
      features = await this.featureRepository.findAll(name, sort[0], sort[1]);
    } else {
      features = await this.featureRepository.findByLimit(
        page,
        size,
        name,
        sort[0],
        sort[1],
      );
    }
    this.logger.log(`Features amount: ${features.length}`);
    return features;
  }

  public async update(
    id: number,
    feature: FeatureDescriptionDto,
  ): Promise<FeatureEntity> {
    this.logger.log(`Request to update feature ${id}`);
    return this.featureRepository.update(id, feature);
  }

  public async getGloballyEnabledFeatures(): Promise<string[]> {
    const globallyEnabledFeatures =
      await this.featureRepository.findGloballyEnabled();
    return globallyEnabledFeatures.map((feature) => feature.name);
  }
}
