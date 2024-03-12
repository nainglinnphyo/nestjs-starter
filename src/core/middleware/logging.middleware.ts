import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggerMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode >= 400 && statusCode <= 500) {
        this.logger.warn(`[${req.method}] ${req.url} - ${statusCode}`);
      }
    });

    next();
  }
}
