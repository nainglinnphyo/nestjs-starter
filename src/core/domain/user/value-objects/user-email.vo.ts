export class Email {
  private constructor(private readonly value: string) {}

  static create(email: string): Email {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('INVALID_EMAIL_FORMAT');
    }
    return new Email(email.toLowerCase());
  }

  getValue(): string {
    return this.value;
  }
}
