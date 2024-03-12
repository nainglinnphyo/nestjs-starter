/* eslint-disable import/order */
/* eslint-disable max-classes-per-file */
/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Test } from '@core/interfaces/app.dto';
import { IResponsePaging } from '@core/interfaces/response.interface';
import { AppService } from './app.service';
import { User } from '@core/decorators/auth.decorators';
import { PrismaService } from '@shared/prisma/prisma.service';
import { BadRequestException } from '@core/exceptions';
import { ExceptionConstants } from '@core/exceptions/constants';

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
