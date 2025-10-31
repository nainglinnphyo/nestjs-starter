import { HttpException, HttpStatus } from '@nestjs/common';

export interface AppErrorPayload {
  code: string; // machine code e.g. 'USER_NOT_FOUND'
  message: string; // human readable
  details?: any; // optional extra details
}

/**
 * Base application exception that always returns a consistent payload.
 */
export class AppException extends HttpException {
  public readonly code: string;

  constructor(
    payload: AppErrorPayload,
    status: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super({ success: false, ...payload }, status);
    this.code = payload.code;
  }
}
