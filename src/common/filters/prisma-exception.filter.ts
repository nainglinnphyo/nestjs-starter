import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { ConflictException } from '../exceptions/conflict.exception';
import { AppException } from '../exceptions/app.exception';
import { ValidationException } from '../exceptions/validation.exception';

/**
 * Maps Prisma client errors to AppExceptions.
 * Apply globally or at modules where Prisma is used.
 */
@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientRustPanicError,
)
export class PrismaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(PrismaExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint failed (code 'P2002')
      if (exception.code === 'P2002') {
        const meta = (exception.meta ?? {}) as any;
        const target = meta.target ?? 'unknown';
        const err = new ConflictException(
          'PRISMA_UNIQUE_CONSTRAINT',
          `Unique constraint failed on ${target}`,
          { meta },
        );
        return res.status(err.getStatus()).json(err.getResponse());
      }

      // Other known errors -> bad request
      const err = new AppException(
        {
          code: 'PRISMA_KNOWN_ERROR',
          message: exception.message,
          details: exception.meta,
        },
        400,
      );
      return res.status(err.getStatus()).json(err.getResponse());
    }

    if (exception instanceof Prisma.PrismaClientValidationError) {
      const err = new ValidationException(
        'PRISMA_VALIDATION_ERROR',
        'Prisma validation error',
        { message: (exception as any).message },
      );
      return res.status(err.getStatus()).json(err.getResponse());
    }

    this.logger.error('Unhandled Prisma exception', exception as any);
    const err = new AppException(
      { code: 'PRISMA_UNKNOWN', message: 'Database error' },
      500,
    );
    return res.status(err.getStatus()).json(err.getResponse());
  }
}
