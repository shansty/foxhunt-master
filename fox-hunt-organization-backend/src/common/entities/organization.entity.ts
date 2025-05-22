import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { OrganizationStatusEnum } from '../enums/OrganizationStatus.enum';
import { OrganizationTypeEnum } from '../enums/OrganizationType.enum';
import { ORGANIZATION_TABLE_NAME, SCHEMA } from '../constants';
import { Transform } from 'class-transformer';
import { UserFeedbackEntity } from './user-feedback.entity';

@Entity(ORGANIZATION_TABLE_NAME, { schema: SCHEMA })
export class OrganizationEntity {
  @Transform(({ value }) => +value)
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'organization_id' })
  id: number;

  @Column('character varying', { name: 'name', length: 50 })
  name: string;

  @Column('character varying', { name: 'legal_address', length: 255 })
  legalAddress: string;

  @Column('character varying', {
    name: 'actual_address',
    nullable: true,
    length: 255,
  })
  actualAddress: string | null;

  @Column('character varying', { name: 'org_domain', unique: true, length: 50 })
  organizationDomain: string;

  @Column({ type: 'enum', enum: OrganizationTypeEnum, name: 'type' })
  type: OrganizationTypeEnum;

  @Column('integer', { name: 'approximate_employees_amount', nullable: true })
  approximateEmployeesAmount: number | null;

  @Column({
    type: 'enum',
    enum: OrganizationStatusEnum,
    name: 'status',
    default: () => OrganizationStatusEnum.NEW,
  })
  status: OrganizationStatusEnum;

  @Column('timestamp without time zone', {
    name: 'created',
    default: () => 'now()',
  })
  created: string;

  @Column('timestamp without time zone', {
    name: 'last_status_change',
    default: () => 'now()',
  })
  lastStatusChange: string;

  @Column('boolean', { name: 'is_system', default: () => 'false' })
  system: boolean;

  @OneToMany(
    () => UserFeedbackEntity,
    (userFeedback) => userFeedback.organizationEntity,
  )
  userFeedback: UserFeedbackEntity[];
}
