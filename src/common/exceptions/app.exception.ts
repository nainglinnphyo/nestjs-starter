import { ERROR_CODES } from './../errors/errors.code';
import { HttpException, HttpStatus } from '@nestjs/common';

export interface AppErrorPayload {
  code: ERROR_CODES; // machine code e.g. 'USER_NOT_FOUND'
  message: string; // human readable
  details?: any; // optional extra details
}

/**
 * Base application exception that always returns a consistent payload.
 */
export class AppException extends HttpException {
  public readonly code: ERROR_CODES;

  constructor(
    payload: AppErrorPayload,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ success: false, ...payload }, status);
    this.code = payload.code;
  }
}
