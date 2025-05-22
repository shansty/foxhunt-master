import { SCHEMA, USER_FEEDBACK_TABLE_NAME } from '../constants';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transform } from 'class-transformer';
import { OrganizationEntity } from './organization.entity';

@Entity(USER_FEEDBACK_TABLE_NAME, { schema: SCHEMA })
export class UserFeedbackEntity {
  @Transform(({ value }) => +value)
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'user_feedback_id' })
  userFeedbackId: number;

  @Column('character varying', { name: 'comment', nullable: true })
  comment: string | null;

  @Column('integer', { name: 'ranking', nullable: true })
  ranking: number | null;

  @Column('timestamp without time zone', { name: 'send_date' })
  sendDate: string;

  @Column('boolean', { name: 'has_read', default: () => 'false' })
  hasRead: boolean;

  @ManyToOne(
    () => OrganizationEntity,
    (organization) => organization.userFeedback,
    { eager: true },
  )
  @JoinColumn([{ name: 'organization_id', referencedColumnName: 'id' }])
  organizationEntity: OrganizationEntity;

  @Column({ type: 'bigint', name: 'user_id' })
  userId: number;
}
