import { Controller, Get } from '@nestjs/common';
import { ExceptionConstants } from '@core/exceptions/constants';
import { BadRequestException } from '@core/exceptions';
import { IResponse } from './core/interfaces/response.interface';

@Controller()
export class AppController {
  // constructor() {}

  @Get()
  testException(): IResponse {
    throw new BadRequestException({
      message: 'Test exception',
      cause: new Error('Test exception'),
      code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      description: 'Test exception',
    });
  }
}
