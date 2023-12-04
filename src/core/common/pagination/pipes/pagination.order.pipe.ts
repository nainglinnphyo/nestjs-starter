/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
/* eslint-disable no-underscore-dangle */
import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { ENUM_PAGINATION_ORDER_DIRECTION_TYPE } from '../constants/pagination.enum.constant';
import { PaginationService } from '../services/pagination.service';
import { PAGINATION_AVAILABLE_ORDER_DIRECTION } from '../constants/pagination.constant';

export function PaginationOrderPipe(
  defaultOrderBy: string,
  defaultOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE,
  availableOrderBy: string[],
): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationOrderPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: any,
      private readonly paginationService: PaginationService,
    ) {}

    async transform(value: Record<string, any>): Promise<Record<string, any>> {
      const orderBy: string = value?.orderBy ?? defaultOrderBy;
      const orderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE = value?.orderDirection ?? defaultOrderDirection;
      const availableOrderDirection: ENUM_PAGINATION_ORDER_DIRECTION_TYPE[] = PAGINATION_AVAILABLE_ORDER_DIRECTION;

      const order: Record<string, any> = this.paginationService.order(orderBy, orderDirection, availableOrderBy);

      this.request.__pagination = {
        ...this.request.__pagination,
        orderBy,
        orderDirection,
        availableOrderBy,
        availableOrderDirection,
      };

      return {
        ...value,
        _order: order,
        _availableOrderBy: availableOrderBy,
        _availableOrderDirection: availableOrderDirection,
      };
    }
  }

  return mixin(MixinPaginationOrderPipe);
}
