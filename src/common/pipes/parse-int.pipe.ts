import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string) {
    const val = parseInt(value, 10);
    if (isNaN(val))
      throw new BadRequestException({
        success: false,
        code: 'INVALID_INT',
        message: 'Expected numeric string',
      });
    return val;
  }
}
