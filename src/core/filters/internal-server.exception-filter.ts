import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomInternalServerErrorException } from '../exceptions/internal-server-error.exception';
import { v4 as uuidv4 } from 'uuid';

@Catch(CustomInternalServerErrorException)
export class InternalServerErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(InternalServerErrorExceptionFilter.name);

  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: CustomInternalServerErrorException, host: ArgumentsHost): void {    
    
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const httpStatus = exception.getStatus();
    exception.setTraceId(uuidv4());
    exception.setPath(httpAdapter.getRequestUrl(ctx.getRequest()));
    const responseBody = exception.generateHttpResponseBody();

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
