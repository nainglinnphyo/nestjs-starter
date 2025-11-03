import {
  ArgumentMetadata,
  Injectable,
  PipeTransform,
  BadRequestException,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { ERROR_CODES } from "@errors/errors.code";

function flattenValidationErrors(errors: ValidationError[]): any {
  const result = {};
  for (const err of errors) {
    if (err.constraints)
      (result as any)[err.property] = Object.values(err.constraints);
    if (err.children?.length)
      (result as any)[err.property] = flattenValidationErrors(
        err.children as any
      );
  }
  return result;
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;
    const object = plainToInstance(metatype, value);
    const errors = await validate(object as object, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });
    if (errors.length > 0) {
      const details = flattenValidationErrors(errors);
      throw new BadRequestException({
        success: false,
        code: ERROR_CODES.INVALID_INPUT,
        message: "Validation failed",
        details,
      });
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
