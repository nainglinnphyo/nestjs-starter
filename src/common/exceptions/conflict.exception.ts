import { HttpStatus } from "@nestjs/common";
import { AppException } from "@exceptions/app.exception";
import { ERROR_CODES } from "@errors/errors.code";
export class ConflictException extends AppException {
  constructor(code: ERROR_CODES, message = "Conflict", details?: any) {
    super({ code, message, details }, HttpStatus.CONFLICT);
  }
}
