/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import { Query } from '@nestjs/common';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../constants/pagination.enum.constant';
import { PaginationOrderPipe } from '../pipes/pagination.order.pipe';
import { PaginationPagingPipe } from '../pipes/pagination.paging.pipe';
import { PaginationSearchPipe } from '../pipes/pagination.search.pipe';

export function PaginationQuery(
  defaultPerPage: number,
  defaultOrderBy: string,
  defaultOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
  availableSearch: string[],
  availableOrderBy: string[],
): ParameterDecorator {
  return Query(
    PaginationSearchPipe(availableSearch),
    PaginationPagingPipe(defaultPerPage),
    PaginationOrderPipe(defaultOrderBy, defaultOrderDirection, availableOrderBy),
  );
}
