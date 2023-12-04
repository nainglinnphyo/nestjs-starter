import { ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { BadRequestException } from './core/exceptions';
import { PaginationQuery } from '@core/common/pagination/decorators/pagination.decorator';
import {
  USER_DEFAULT_AVAILABLE_ORDER_BY,
  USER_DEFAULT_AVAILABLE_SEARCH,
  USER_DEFAULT_ORDER_BY,
  USER_DEFAULT_ORDER_DIRECTION,
  USER_DEFAULT_PER_PAGE,
} from '@core/constants/user.constants';
import { PaginationListDto } from '@core/common/pagination/dtos/pagination.list.dto';

@ApiTags('Health-check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(
    @PaginationQuery(
      USER_DEFAULT_PER_PAGE,
      USER_DEFAULT_ORDER_BY,
      USER_DEFAULT_ORDER_DIRECTION,
      USER_DEFAULT_AVAILABLE_SEARCH,
      USER_DEFAULT_AVAILABLE_ORDER_BY,
    )
    { _search, _limit, _offset, _order }: PaginationListDto,
  ): string {
    console.log({ _search, _limit, _offset, _order });
    throw new BadRequestException({ message: 'GG', cause: { message: 'gg', name: 'GG', stack: 'G' }, code: 2000, description: 'g' });
    return this.appService.getHello();
  }
}
