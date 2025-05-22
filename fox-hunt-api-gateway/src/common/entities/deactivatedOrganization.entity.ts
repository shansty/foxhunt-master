import { Type } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('deactivated_organizations', { schema: 'fh_admin' })
export class DeactivatedOrganizationEntity {
  @Type(() => Number)
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Type(() => Number)
  @Column('bigint', { name: 'organization_id' })
  organizationId: number;

  @Column('timestamptz', { name: 'created_date' })
  creationDate: Date;
}
