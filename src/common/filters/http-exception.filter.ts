import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../exceptions/app.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // If it's our AppException (already shaped), return as-is
    if (exception instanceof AppException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      this.logger.error(
        `${req.method} ${req.url} -> ${JSON.stringify(payload)}`,
      );
      return res.status(status).json(payload);
    }

    // Nest HttpException (framework-level)
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      this.logger.error(`HttpException: ${JSON.stringify(payload)}`);
      return res.status(status).json({
        success: false,
        code: 'HTTP_ERROR',
        message: (payload as any)?.message || exception.message,
        details: payload,
      });
    }

    // Unhandled -> 500
    this.logger.error('UnhandledException', exception as any);
    return res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    });
  }
}
