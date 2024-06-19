import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { InternalServerErrorException } from '../exceptions/internal-server-error.exception';

@Catch(InternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(InternalServerErrorExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: InternalServerErrorException, host: ArgumentsHost): void {
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
