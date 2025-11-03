import { HttpStatus } from "@nestjs/common";
import { ERROR_CODES } from "@errors/errors.code";
import { AppException } from "@exceptions/app.exception";

export class ValidationException extends AppException {
  constructor(
    code = ERROR_CODES.INVALID_INPUT,
    message = "Validation failed",
    details?: any
  ) {
    super({ code, message, details }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
