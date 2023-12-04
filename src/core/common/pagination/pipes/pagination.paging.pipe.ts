/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
/* eslint-disable no-underscore-dangle */
import { Inject, Injectable, mixin, Type } from '@nestjs/common';
import { PipeTransform, Scope } from '@nestjs/common/interfaces';
import { REQUEST } from '@nestjs/core';
import { PaginationService } from '../services/pagination.service';

export function PaginationPagingPipe(defaultPerPage: number): Type<PipeTransform> {
  @Injectable({ scope: Scope.REQUEST })
  class MixinPaginationPagingPipe implements PipeTransform {
    constructor(
      @Inject(REQUEST) protected readonly request: any,
      private readonly paginationService: PaginationService,
    ) {}

    async transform(value: Record<string, any>): Promise<Record<string, any>> {
      const page: number = parseInt(value?.page, 10) || 1;
      const perPage: number = parseInt(value?.perPage, 10) || defaultPerPage;
      const offset: number = this.paginationService.offset(page, perPage);

      this.request.__pagination = {
        ...this.request.__pagination,
        page,
        perPage,
      };

      return {
        ...value,
        page,
        perPage,
        _limit: perPage,
        _offset: offset,
      };
    }
  }

  return mixin(MixinPaginationPagingPipe);
}
