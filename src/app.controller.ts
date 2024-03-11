/* eslint-disable import/order */
/* eslint-disable max-classes-per-file */
/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Test } from '@core/interfaces/app.dto';
import { IResponsePaging } from '@core/interfaces/response.interface';
import { AppService } from './app.service';
import { User } from '@core/decorators/auth.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
