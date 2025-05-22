import { Type } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('role', { schema: 'fh_admin' })
export class RoleEntity {
  @Type(() => Number)
  @PrimaryGeneratedColumn()
  role_id: number;

  @Column('character varying', { name: 'role', length: 20 })
  role: string;
}
