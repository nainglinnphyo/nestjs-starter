export class DomainException extends Error {
  public readonly code: string;
  public readonly details?: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'DomainException';
    this.code = code;
    this.details = details;
  }
}
