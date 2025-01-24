import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus, NotFoundException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { ExceptionConstants } from '../exceptions/constants';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: NotFoundException, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const traceId = uuidv4();

    const responseBody = {
      _metadata: {
        message: exception.message || 'Resource Not Found',
        description: 'The requested resource could not be found',
        timestamp: new Date().toISOString(),
        code: ExceptionConstants.BadRequestCodes.RESOURCE_NOT_FOUND,
        traceId,
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      },
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, HttpStatus.NOT_FOUND);
  }
}
