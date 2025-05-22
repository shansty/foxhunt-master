import { Transform } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('refresh_token_ids', { schema: 'fh_admin' })
export class RefreshTokenEntity {
  @Transform(({ value }) => +value)
  @PrimaryGeneratedColumn()
  refresh_token_id: number;

  @Column({ type: 'date' })
  creation_date: string;
}
