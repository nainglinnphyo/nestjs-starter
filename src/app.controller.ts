import { AppService } from '@app/app.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ExceptionConstants } from '@core/exceptions/constants';
import { PrismaService } from '@shared/prisma/prisma.service';
import { BadRequestException } from './core/exceptions/bad-request.exception';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: PrismaService,
  ) {}

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
