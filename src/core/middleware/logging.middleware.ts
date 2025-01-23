import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Logger Middleware');

  use(req: Request, res: Response, next: NextFunction) {
    req.headers['x-request-id'] = req.headers['x-request-id'] || randomUUID();
    const traceId = req.headers['x-request-id'];

    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode >= 400 && statusCode <= 500) {
        const errorMessage = res.locals.errorMessage || 'Unknown error';
        const errorStack = res.locals.errorStack || '';

        this.logger.warn(`[${traceId}] [${req.method}] ${req.url} - ${statusCode} - ${errorMessage}`);

        if (errorStack) {
          this.logger.error(`[${traceId}] Error Stack: ${errorStack}`);
        }
      }
    });

    res.on('error', (err) => {
      const errorMessage = err?.message || 'Unknown error';
      const errorStack = err?.stack || '';
      res.locals.errorMessage = errorMessage;
      res.locals.errorStack = errorStack;
    });

    next();
  }
}
