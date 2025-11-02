import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';
import { ERROR_CODES } from '../errors/errors.code';

export class ValidationException extends AppException {
  constructor(
    code = ERROR_CODES.INVALID_INPUT,
    message = 'Validation failed',
    details?: any,
  ) {
    super({ code, message, details }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
