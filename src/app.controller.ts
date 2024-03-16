import { BadRequestException } from '@core/exceptions';
import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from '@core/exceptions/constants';
import { IResponse } from './core/interfaces/response.interface';

@Controller()
export class AppController {
  // constructor() {}

  @Get('api')
  testException(): IResponse {
    return {
      _data: { msg: 'hello world' },
      _metadata: { message: 'that is msg', statusCode: HttpStatus.OK },
    };
    throw new BadRequestException({
      message: 'Test exception',
      cause: new Error('Test exception'),
      code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      description: 'Test exception',
    });
  }
}
