import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PageSizeDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly page?: number = 0;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  readonly size?: number;
}
