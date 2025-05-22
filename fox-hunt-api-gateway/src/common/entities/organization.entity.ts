import { Type } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('organization', { schema: 'fh_admin' })
export class OrganizationEntity {
  @Type(() => Number)
  @PrimaryGeneratedColumn()
  organization_id: number;

  @Column('character varying', { name: 'org_domain', length: 50 })
  organizationDomain: string;
}
