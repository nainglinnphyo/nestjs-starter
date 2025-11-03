import { ERROR_CODES } from "@errors/errors.code";
import { AppException } from "@exceptions/app.exception";
import { HttpStatus } from "@nestjs/common";

export class NotFoundException extends AppException {
  constructor(
    code: ERROR_CODES,
    message = "Resource not found",
    details?: any
  ) {
    super({ code, message, details }, HttpStatus.NOT_FOUND);
  }
}
