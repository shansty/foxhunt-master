import {
  Entity,
  Column,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('user_invitation', { schema: 'fh_admin' })
export class UserInvitationEntity {
  @PrimaryGeneratedColumn({ name: 'user_invitation_id' })
  userInvitationId: number;

  @Column('integer', { name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.organizationUserRoles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column('integer', { name: 'organization_id' })
  organizationId: number;

  @Column('timestamptz', { name: 'start_date' })
  startDate: Date;

  @Column('timestamptz', { name: 'end_date' })
  endDate: Date;

  @Column('character varying', { name: 'token' })
  token: string;

  @Column('character varying', { name: 'status' })
  status: string;

  @Column('integer', { name: 'email_template_id' })
  emailTemplateId: number;
}
