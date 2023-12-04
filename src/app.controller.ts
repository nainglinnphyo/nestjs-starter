/* eslint-disable import/order */
/* eslint-disable max-classes-per-file */
/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Test } from '@core/interfaces/app.dto';
import { IResponsePaging } from '@core/interfaces/response.interface';
import { AppService } from './app.service';
import { User } from '@core/decorators/auth.decorators';

@ApiTags('Health-check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @HttpCode(HttpStatus.OK)
  @Post()
  @ApiBody({
    type: Test,
  })
  @ApiResponse({ status: 200, description: 'The record has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  getHello(@Body() body: Test, @User() user): IResponsePaging {
    // console.log(body);
    // throw new BadRequestException({
    //   message: 'error',
    //   code: 10000,
    //   cause: {
    //     message: 'cause',
    //     name: 'cuase name',
    //   },
    //   description: 'des',
    // });
    console.log(user);
    return {
      _metadata: {
        message: 'success',
        statusCode: HttpStatus.OK,
      },
      data: [
        {
          userId: '24444',
        },
      ],
      _pagination: {
        total: 1000,
        totalPage: 10,
      },
    };
  }
}
