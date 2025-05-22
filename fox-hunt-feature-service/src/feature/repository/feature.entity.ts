import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { FEATURE_TABLE_NAME, SCHEMA } from '../../common/constants/dbConstants';
import { Transform } from 'class-transformer';
import { FeatureOrganizationEntity } from '../../feature-organization/repository/feature-organization.entity';

@Entity(FEATURE_TABLE_NAME, { schema: SCHEMA })
export class FeatureEntity {
  @Transform(({ value }) => +value)
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'feature_id' })
  id: number;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column('character varying', {
    name: 'description',
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column('character varying', {
    name: 'display_name',
    nullable: true,
    length: 255,
  })
  displayName: string | null;

  @Column('boolean', { name: 'is_globally_enabled', default: () => 'false' })
  isGlobalyEnabled: boolean;

  @OneToMany(
    () => FeatureOrganizationEntity,
    (featureOrganization) => featureOrganization.featureEntity,
  )
  featureOrganization?: FeatureOrganizationEntity[];
}
