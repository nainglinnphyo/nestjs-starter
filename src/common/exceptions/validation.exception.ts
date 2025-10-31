import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class ValidationException extends AppException {
  constructor(
    code = 'VALIDATION_FAILED',
    message = 'Validation failed',
    details?: any,
  ) {
    super({ code, message, details }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
