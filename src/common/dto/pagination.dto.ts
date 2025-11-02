import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    description: 'Page number (starts from 1)',
    minimum: 1,
    default: 1,
    required: false,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Page must be a valid number' },
  )
  @Min(1, { message: 'Page number must be at least 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Number of items per page',
    minimum: 1,
    maximum: 100,
    default: 10,
    required: false,
    example: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Page size must be a valid number' },
  )
  @Min(1, { message: 'Page size must be at least 1' })
  @Max(100, { message: 'Page size cannot exceed 100 items' })
  pageSize?: number = 10;

  get offset() {
    return (this.page - 1) * this.pageSize;
  }
  get limit() {
    return this.pageSize;
  }
}
