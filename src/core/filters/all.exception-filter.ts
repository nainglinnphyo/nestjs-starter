import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ExceptionConstants } from '@core/exceptions/constants';
import { HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';

interface ErrorResponse {
  response: {
    message: string;
    error: string;
    statusCode: number;
  };
  status: number;
  options: Record<string, any>; // Adjust this based on the actual structure of options
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    const specificException = exception as ErrorResponse;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const traceId = request.headers['x-request-id'] || '';
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    // console.log(exception);
    const responseBody = {
      _metadata: {
        message: specificException.response.message,
        description: specificException.response.error,
        timestamp: new Date().toISOString(),
        code:
          specificException.response.statusCode === 404
            ? ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND
            : ExceptionConstants.InternalServerErrorCodes.INTERNAL_SERVER_ERROR,
        traceId,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
