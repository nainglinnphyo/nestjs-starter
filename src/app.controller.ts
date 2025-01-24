import { Controller, Get } from '@nestjs/common';
import { ExceptionConstants } from '@core/exceptions/constants';
import { BadRequestException } from './core/exceptions/bad-request.exception';

@Controller()
export class AppController {
  @Get()
  async testException() {
    throw new BadRequestException({
      message: 'Not Allowed',
      cause: new Error('Test exception'),
      code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      description: 'Test exception',
    });
  }
}
