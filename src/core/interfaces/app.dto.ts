import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class Test {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
