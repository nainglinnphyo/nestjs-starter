import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus, GatewayTimeoutException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { ExceptionConstants } from '../exceptions/constants';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const traceId = (request.headers['x-request-id'] as string) || '';

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let responseBody: any;

    let code =
      exception instanceof GatewayTimeoutException
        ? ExceptionConstants.InternalServerErrorCodes.GATE_WAY_TIME_OUT
        : ExceptionConstants.InternalServerErrorCodes.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      responseBody = {
        _metadata: {
          message: 'Unknown error occurred',
          description: (exceptionResponse as any)?.error || exception.message,
          timestamp: new Date().toISOString(),
          code,
          traceId,
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
        },
      };
    } else {
      responseBody = {
        _metadata: {
          message: 'Unknown error occurred',
          description: (exception as Error)?.message || 'Unexpected error occurred',
          timestamp: new Date().toISOString(),
          code,
          traceId,
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
        },
      };
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
