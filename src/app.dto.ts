import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AppDto {
  @IsNotEmpty()
  @IsString()
  data: string;

  @IsNotEmpty()
  @IsInt()
  age: number;
}
