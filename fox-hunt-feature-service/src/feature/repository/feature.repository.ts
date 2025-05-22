import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FeatureEntity } from 'src/feature/repository/feature.entity';
import { FeatureDescriptionDto } from 'src/feature/dto/updateFeatureDescription.dto';
import { Repository, ILike } from 'typeorm';

@Injectable()
export class FeatureRepository {
  constructor(
    @InjectRepository(FeatureEntity)
    private featureRepository: Repository<FeatureEntity>,
  ) {}

  async findAll(
    name: string,
    sort: string,
    order: string,
  ): Promise<FeatureEntity[]> {
    return await this.featureRepository.find({
      where: [{ name: ILike(`%${name}%`) }],
      order: { [sort]: order },
    });
  }

  async findByLimit(
    page: number,
    pageSize: number,
    name: string,
    sort: string,
    order: string,
  ): Promise<FeatureEntity[]> {
    return await this.featureRepository.find({
      skip: page * pageSize,
      take: pageSize,
      where: [{ name: ILike(`%${name}%`) }],
      order: { [sort]: order },
    });
  }

  async findGloballyEnabled() {
    return await this.featureRepository.find({
      where: { isGlobalyEnabled: true },
    });
  }

  async update(
    id: number,
    feature: FeatureDescriptionDto,
  ): Promise<FeatureEntity> {
    const queryResponse: { raw: FeatureEntity[] } = await this.featureRepository
      .createQueryBuilder()
      .update(FeatureEntity, feature)
      .where('id = :id', { id })
      .returning('*')
      .updateEntity(true)
      .execute();
    return queryResponse.raw[0];
  }
}
