import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { v4 as uuidv4 } from 'uuid';
import { GatewayTimeoutException } from '../exceptions/gateway-timeout.exception';

@Catch(GatewayTimeoutException)
export class GatewayTimeOutExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GatewayTimeoutException.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: GatewayTimeoutException, host: ArgumentsHost): void {
    this.logger.debug('exception');

    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus = exception.getStatus();
    exception.setTraceId(uuidv4());
    exception.setPath(httpAdapter.getRequestUrl(ctx.getRequest()));

    const responseBody = exception.generateHttpResponseBody();

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
