import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppException } from '../exceptions/app.exception';
import { Prisma } from '@prisma/client';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import * as Sentry from '@sentry/nestjs';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  @SentryExceptionCaptured()
  catch(exception: unknown, host: ArgumentsHost) {
    Sentry.captureException(exception);
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const now = Date.now();

    // If it's our AppException (already shaped), return as-is
    if (exception instanceof AppException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      this.logger.error(
        `${req.method} ${req.url} -> ${JSON.stringify(payload)}`,
      );
      const response =
        typeof payload === 'object'
          ? {
              ...payload,
              path: req.path,
              duration: `${Date.now() - now}ms`,
              method: req.method,
            }
          : payload;
      return res.status(status).json(response);
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
        path: req.path,
        duration: `${Date.now() - now}ms`,
        method: req.method,
      });
    }

    if (
      exception instanceof Prisma.PrismaClientKnownRequestError ||
      exception instanceof Prisma.PrismaClientValidationError ||
      exception instanceof Prisma.PrismaClientRustPanicError ||
      exception instanceof Prisma.PrismaClientInitializationError ||
      exception instanceof Prisma.PrismaClientUnknownRequestError
    ) {
      const status = 500;
      const payload = exception.message;
      this.logger.error(`PRISMA EXCEPTION : ${JSON.stringify(payload)}`);
      return res.status(status).json({
        success: false,
        code: 'DATABASE_ERROR',
        message: payload,
        details: null,
        path: req.path,
        duration: `${Date.now() - now}ms`,
        method: req.method,
      });
    }

    // Unhandled -> 500
    this.logger.error('UnhandledException', exception as any);

    return res.status(500).json({
      success: false,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      path: req.path,
      duration: `${Date.now() - now}ms`,
      method: req.method,
    });
  }
}
