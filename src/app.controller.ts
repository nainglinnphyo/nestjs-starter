import { AppService } from '@app/app.service';
import { BadRequestException } from '@core/exceptions';
import { Controller, Get } from '@nestjs/common';
import { ExceptionConstants } from '@core/exceptions/constants';
import { PrismaService } from '@shared/prisma/prisma.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: PrismaService,
  ) {}

  @Get()
  async testException() {
    throw new BadRequestException({
      message: 'Test exception',
      cause: new Error('Test exception'),
      code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      description: 'Test exception',
    });
  }
}
