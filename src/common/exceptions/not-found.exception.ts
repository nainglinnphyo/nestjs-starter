import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ERROR_CODES } from '../errors/errors.code';

export class NotFoundException extends AppException {
  constructor(
    code: ERROR_CODES,
    message = 'Resource not found',
    details?: any,
  ) {
    super({ code, message, details }, HttpStatus.NOT_FOUND);
  }
}
