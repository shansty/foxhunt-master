import { Type } from 'class-transformer';
import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Entity('organization_user_role', { schema: 'fh_admin' })
export class OrganizationUserRoleEntity {
  @PrimaryColumn()
  role_id: number;

  @ManyToOne(() => RoleEntity)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @Column('integer', { name: 'user_id' })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.organizationUserRoles)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column('integer', { name: 'organization_id' })
  @Type(() => Number)
  organizationId: number;

  @Column('boolean', { name: 'is_active' })
  isActive: boolean;
}
