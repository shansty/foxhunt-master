import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { FeatureOrganizationEntity } from './feature-organization.entity';
import {
  FeatureOrganizationIsEnabledData,
  FeatureOrganizationRaw,
  FeatureOrganizationResponse,
  IFeatureOrganizationRelation,
} from '../interfaces/featureOrganization.interface';
import { DataSource } from 'typeorm';

@Injectable()
export class FeatureOrganizationRepository {
  private readonly logger = new Logger(FeatureOrganizationRepository.name);

  constructor(
    @InjectRepository(FeatureOrganizationEntity)
    private featureOrganizationRepository: Repository<FeatureOrganizationEntity>,
    private dataSource: DataSource,
  ) {}

  async findAllRaw(): Promise<FeatureOrganizationRaw[]> {
    return await this.featureOrganizationRepository
      .createQueryBuilder()
      .getRawMany();
  }

  async findByOrganizationId(
    organizationId: number,
  ): Promise<FeatureOrganizationIsEnabledData[]> {
    return await this.featureOrganizationRepository
      .createQueryBuilder('feature-organization')
      .where('feature-organization.organizationEntity = :id', {
        id: organizationId,
      })
      .leftJoinAndSelect('feature-organization.featureEntity', 'featureEntity')
      .select('feature-organization.isEnabled')
      .addSelect('featureEntity.name')
      .getMany();
  }

  async deleteManyByQueryString(
    queryRunner,
    stringWithDeleteEntitiesValues: string,
  ): Promise<number> {
    const deleteResult: { affected: number } = await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from(FeatureOrganizationEntity, 'featureOrganizationEntity')
      .where(
        `(organization_id, feature_id) in (values ${stringWithDeleteEntitiesValues})`,
      )
      .execute();
    this.logger.verbose(
      `Updated string in transaction: ${deleteResult.affected}`,
    );
    return deleteResult.affected;
  }

  private createStringWithDeleteEntities(
    featureOrganizationRelations: IFeatureOrganizationRelation[],
  ): string {
    let deleteValuesString = '';
    featureOrganizationRelations.forEach((relation) => {
      relation.organizationEntity;
      deleteValuesString += `(${relation.organizationEntity}, ${relation.featureEntity}), `;
    });
    deleteValuesString = deleteValuesString.substring(
      0,
      deleteValuesString.length - 2,
    );
    return deleteValuesString;
  }

  async createFeatureOrganizationRelations(
    featureOrganizationRelations: IFeatureOrganizationRelation[],
  ) {
    const stringOfDeletedRelations = this.createStringWithDeleteEntities(
      featureOrganizationRelations,
    );
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let affectedRelations = 0;
    try {
      affectedRelations = await this.deleteManyByQueryString(
        queryRunner,
        stringOfDeletedRelations,
      );
      await queryRunner.manager.save(
        FeatureOrganizationEntity,
        featureOrganizationRelations,
      );
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
      return affectedRelations;
    }
  }

  async findFeaturesOfSpecificOrganizations(
    organizations: FeatureOrganizationResponse[],
  ): Promise<FeatureOrganizationRaw[]> {
    const organizationsIds: string[] = organizations.map((organization) => {
      return `${organization.id}`;
    });
    return await this.featureOrganizationRepository
      .createQueryBuilder()
      .where('organization_id IN(:...ids)', {
        ids: [null, ...organizationsIds],
      })
      .getRawMany();
  }
}
