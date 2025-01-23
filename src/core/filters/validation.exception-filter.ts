import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ValidationError } from 'class-validator';
import { Request } from 'express';
import { BadRequestException } from '../exceptions/bad-request.exception';
import { ExceptionConstants } from '../exceptions/constants';

/**
 * An exception filter to handle validation errors thrown by class-validator.
 */
@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ValidationExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: ValidationError, host: ArgumentsHost): void {
    this.logger.verbose(exception);
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const httpStatus = HttpStatus.UNPROCESSABLE_ENTITY;
    const request = ctx.getRequest<Request>();
    const traceId = request.headers['x-request-id'];

    const errorMsg = exception.constraints || exception.children?.[0]?.constraints;

    const err = BadRequestException.VALIDATION_ERROR(Object.values(errorMsg || {})[0]);
    const responseBody = {
      _metadata: {
        message: "Let's take a look at validation error",
        description: this.formatValidationErrors(exception),
        timestamp: new Date().toISOString(),
        code: ExceptionConstants.BadRequestCodes.VALIDATION_ERROR,
        traceId,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }

  private formatValidationErrors(validationError: ValidationError): (string | undefined)[] {
    const constraints = validationError.constraints || {};
    const errors = Object.values(constraints);

    return errors.length ? errors : ['Invalid Input'];
  }
}
