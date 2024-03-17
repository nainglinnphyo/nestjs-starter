import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  constructor(
    @Inject('async_storage')
    private readonly asyncStorage: AsyncLocalStorage<Map<string, string>>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const traceId = req.headers['x-request-id'] || randomUUID();
    const store = new Map().set('traceId', traceId);
    this.asyncStorage.run(store, () => {
      next();
    });
    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode >= 400 && statusCode <= 500) {
        this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
      }
    });
  }
}
