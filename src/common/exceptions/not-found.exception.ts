import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class NotFoundException extends AppException {
  constructor(code: string, message = 'Resource not found', details?: any) {
    super({ code, message, details }, HttpStatus.NOT_FOUND);
  }
}
