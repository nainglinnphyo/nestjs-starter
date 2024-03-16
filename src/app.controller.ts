import { Controller, Get } from '@nestjs/common';
import { ExceptionConstants } from '@core/exceptions/constants';
import { IResponse } from './core/interfaces/response.interface';
import { ForbiddenException } from './core/exceptions/forbidden.exception';

@Controller()
export class AppController {
  // constructor() {}

  @Get('api')
  testException(): IResponse {
    throw new ForbiddenException({
      message: 'Test exception',
      cause: new Error('Test exception'),
      code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      description: 'Test exception',
    });
  }
}
