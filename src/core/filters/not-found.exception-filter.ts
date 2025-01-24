import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { NotFoundException } from '@core/exceptions/not-found.exception';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(NotFoundException.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: NotFoundException, host: ArgumentsHost): void {
    this.logger.verbose(exception);

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const httpStatus = exception.getStatus();
    const traceId = request.headers.get('x-request-id') || '';
    exception.setTraceId(traceId);
    exception.setPath(httpAdapter.getRequestUrl(ctx.getRequest()));

    const responseBody = exception.generateHttpResponseBody();

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
