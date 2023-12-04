import { ApiProperty } from '@nestjs/swagger';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../constants/pagination.enum.constant';
import { IPaginationOrder } from '../interfaces/pagination.interface';

export class PaginationListDto {
  @ApiProperty()
  _search: Record<string, any>;

  @ApiProperty()
  _limit: number;

  @ApiProperty()
  _offset: number;

  @ApiProperty()
  _order: IPaginationOrder;

  @ApiProperty()
  _availableOrderBy: string[];

  @ApiProperty()
  _availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[];
}
