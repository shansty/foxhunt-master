import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { ISortData } from 'src/organization/interfaces/interfaces';
import { Order } from '../enums/Order.enum';
import { Sort } from '../enums/Sort.enum';

export class SortDataDto {
  @IsOptional()
  @Transform(({ value }) => {
    const sort = value.split(',');
    if (sort.length == 2) {
      if (
        Object.values(Sort).includes(sort[0]) &&
        Object.values(Order).includes(sort[1].toUpperCase())
      )
        return [<Sort>sort[0], <Order>sort[1].toUpperCase()];
    }
    return [Sort.ID, Order.ASC];
  })
  readonly sort?: ISortData = [Sort.ID, Order.ASC];
}
