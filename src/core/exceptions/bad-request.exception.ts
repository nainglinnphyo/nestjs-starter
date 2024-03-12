import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from './constants';
import { IException, IHttpBadRequestExceptionResponse } from './interface';

export class BadRequestException extends HttpException {
  @ApiProperty({
    enum: ExceptionConstants.BadRequestCodes,
    description: 'A unique code identifying the error.',
    example: ExceptionConstants.BadRequestCodes.VALIDATION_ERROR,
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
  description: string; // Description of the exception

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
    super(exception.message, HttpStatus.BAD_REQUEST, {
      cause: exception.cause,
      description: exception.description,
    });

    this.message = exception.message;
    this.cause = exception.cause;
    this.description = exception.description;
    this.code = exception.code;
    this.timestamp = new Date().toISOString();
  }

  setTraceId = (traceId: string) => {
    this.traceId = traceId;
  };

  setPath = (path: string) => {
    this.path = path;
  };

  generateHttpResponseBody = (message?: string): IHttpBadRequestExceptionResponse => {
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

  static HTTP_REQUEST_TIMEOUT = () => {
    return new BadRequestException({
      message: 'HTTP Request Timeout',
      code: ExceptionConstants.BadRequestCodes.HTTP_REQUEST_TIMEOUT,
    });
  };

  static RESOURCE_ALREADY_EXISTS = (msg?: string) => {
    return new BadRequestException({
      message: msg || 'Resource Already Exists',
      code: ExceptionConstants.BadRequestCodes.RESOURCE_ALREADY_EXISTS,
    });
  };

  static RESOURCE_NOT_FOUND = (msg?: string) => {
    return new BadRequestException({
      message: msg || 'Resource Not Found',
      code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
    });
  };

  static VALIDATION_ERROR = (msg?: string) => {
    return new BadRequestException({
      message: msg || 'Validation Error',
      code: ExceptionConstants.BadRequestCodes.VALIDATION_ERROR,
    });
  };

  static UNEXPECTED = (msg?: string) => {
    return new BadRequestException({
      message: msg || 'Unexpected Error',
      code: ExceptionConstants.BadRequestCodes.UNEXPECTED_ERROR,
    });
  };

  static INVALID_INPUT = (msg?: string) => {
    return new BadRequestException({
      message: msg || 'Invalid Input',
      code: ExceptionConstants.BadRequestCodes.INVALID_INPUT,
    });
  };
}
