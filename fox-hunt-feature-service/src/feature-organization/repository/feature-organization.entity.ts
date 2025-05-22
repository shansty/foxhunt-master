import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { FeatureEntity } from '../../feature/repository/feature.entity';
import {
  FEATURE_ORGANIZATION_TABLE_NAME,
  SCHEMA,
} from '../../common/constants/dbConstants';

@Entity(FEATURE_ORGANIZATION_TABLE_NAME, { schema: SCHEMA })
export class FeatureOrganizationEntity {
  @Transform(({ value }) => +value)
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'feature_organization_id' })
  id: number;

  @Column('boolean', { name: 'is_enabled', default: () => 'false' })
  isEnabled: boolean;

  @Column('bigint', { name: 'organization_id', nullable: true })
  organizationEntity: number | null;

  @ManyToOne(() => FeatureEntity, (feature) => feature.featureOrganization, {
    eager: true,
  })
  @JoinColumn([{ name: 'feature_id', referencedColumnName: 'id' }])
  featureEntity: FeatureEntity;
}
