/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from './constants';
import { IException, IHttpUnauthorizedExceptionResponse } from './interface';

export class UnauthorizedException extends HttpException {
  @ApiProperty({
    enum: ExceptionConstants.UnauthorizedCodes,
    description: 'A unique code identifying the error.',
    example: ExceptionConstants.UnauthorizedCodes.AUTHENTICATION_FAILED,
  })
  code: number; // Internal status code

  @ApiHideProperty()
  cause: Error; // Error object causing the exception

  @ApiProperty({
    description: 'Message for the exception',
    example: 'Bad Request',
  })
  message: string; // Message for the exception

  @ApiProperty({
    description: 'A description of the error message.',
    example: 'The input provided was invalid',
  })
  description?: string; // Description of the exception

  @ApiProperty({
    description: 'Timestamp of the exception',
    format: 'date-time',
    example: '2022-12-31T23:59:59.999Z',
  })
  timestamp: string; // Timestamp of the exception

  @ApiProperty({
    description: 'Trace ID of the request',
    example: '65b5f773-df95-4ce5-a917-62ee832fcdd0',
  })
  traceId: string; // Trace ID of the request

  @ApiProperty({
    description: 'Request path',
    example: '/',
  })
  path: string; // Trace ID of the request

  constructor(exception: IException) {
    super(exception.message, HttpStatus.UNAUTHORIZED, {
      cause: exception.cause,
      description: exception.description,
    });

    this.message = exception.message;
    this.cause = exception.cause ?? new Error();
    this.description = exception.description;
    this.code = exception.code ?? HttpStatus.UNAUTHORIZED;
    this.timestamp = new Date().toISOString();
  }

  setTraceId = (traceId: string) => {
    this.traceId = traceId;
  };

  setPath = (path: string) => {
    this.path = path;
  };

  generateHttpResponseBody = (message?: string): IHttpUnauthorizedExceptionResponse => {
    return {
      _metadata: {
        message: message || this.message,
        description: this.description,
        timestamp: this.timestamp,
        code: this.code,
        traceId: this.traceId,
        path: this.path,
      },
    };
  };
}
