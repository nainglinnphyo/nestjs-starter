import { AppService } from '@app/app.service';
import { Controller, Get, Query } from '@nestjs/common';
import { ExceptionConstants } from '@core/exceptions/constants';
import { PrismaService } from '@shared/prisma/prisma.service';
import { BadRequestException } from './core/exceptions/bad-request.exception';
import { AppDto } from './app.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly dbService: PrismaService,
  ) {}

  @Get()
  async testException(@Query() dto: AppDto) {
    console.log(dto);
    throw new BadRequestException({
      message: 'Not Allowed',
      cause: new Error('Test exception'),
      code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
      description: 'Test exception',
    });
  }
}
