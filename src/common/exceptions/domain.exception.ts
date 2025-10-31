import { ERROR_CODES } from '../errors/errors.code';

export class DomainException extends Error {
  public readonly code: ERROR_CODES;
  public readonly details?: any;

  constructor(code: ERROR_CODES, message: string, details?: any) {
    super(message);
    this.name = 'DomainException';
    this.code = code;
    this.details = details;
  }
}
