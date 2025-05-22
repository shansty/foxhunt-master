import { Type } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { OrganizationUserRoleEntity } from './organizationUserRole.entity';

@Entity('app_user', { schema: 'fh_admin' })
export class UserEntity {
  @Type(() => Number)
  @PrimaryGeneratedColumn({ name: 'app_user_id' })
  appUserId: number;

  @Column('character varying', { name: 'email', length: 40 })
  email: string;

  @Column('character varying', { name: 'password', length: 100 })
  password: string;

  @Column('boolean', { name: 'is_activated' })
  isActivated: boolean;

  @Column('character varying', { name: 'first_name' })
  firstName: string;

  @Column('character varying', { name: 'last_name' })
  lastName: string;

  @Column('character varying', { name: 'date_of_birth' })
  birthDate: string;

  @Column('character varying', { name: 'country' })
  country: string;

  @Column('character varying', { name: 'city' })
  city: string;

  @OneToMany(
    () => OrganizationUserRoleEntity,
    (organizationUserRole) => organizationUserRole.user,
  )
  organizationUserRoles: OrganizationUserRoleEntity[];
}
