import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { PaginationDto } from '../dto/pagination.dto';

export const Pagination = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): PaginationDto => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    // Convert query params into PaginationDto
    const pagination = plainToInstance(PaginationDto, query, {
      enableImplicitConversion: true,
    });

    // Validate DTO
    const errors = validateSync(pagination, {
      skipMissingProperties: false,
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formatted = errors.map((e) => Object.values(e.constraints)).flat();
      throw new Error(`Pagination validation failed: ${formatted.join(', ')}`);
    }

    return pagination;
  },
);
