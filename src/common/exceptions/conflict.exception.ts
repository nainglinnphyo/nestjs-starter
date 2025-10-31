import { HttpStatus } from '@nestjs/common';
import { AppException } from './app.exception';

export class ConflictException extends AppException {
  constructor(code: string, message = 'Conflict', details?: any) {
    super({ code, message, details }, HttpStatus.CONFLICT);
  }
}
