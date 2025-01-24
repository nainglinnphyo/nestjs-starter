import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { ExceptionConstants } from './constants';
import { IException, IHttpInternalServerErrorExceptionResponse } from './interface';

export class InternalServerErrorException extends HttpException {
  @ApiProperty({
    enum: ExceptionConstants.InternalServerErrorCodes,
    description: 'A unique code identifying the error.',
    example: ExceptionConstants.InternalServerErrorCodes.UNEXPECTED_ERROR,
  })
  code: number; // Internal status code

  @ApiHideProperty()
  cause: Error; // Error object causing the exception

  @ApiProperty({
    description: 'Message for the exception',
    example: 'Internal Server Error',
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
  path: string; // requested path

  constructor(exception: IException) {
    super(exception.message, HttpStatus.INTERNAL_SERVER_ERROR, {
      cause: exception.cause,
      description: exception.description,
    });

    this.message = exception.message;
    this.cause = exception.cause ?? new Error(exception.message);
    this.description = exception.description;
    this.code = exception.code ?? HttpStatus.INTERNAL_SERVER_ERROR;
    this.timestamp = new Date().toISOString();
  }

  setTraceId = (traceId: string) => {
    this.traceId = traceId;
  };

  setPath = (path: string) => {
    this.path = path;
  };

  generateHttpResponseBody = (message?: string): IHttpInternalServerErrorExceptionResponse => {
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
