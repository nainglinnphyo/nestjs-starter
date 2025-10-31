import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'uuid', description: 'Unique ID of the user' })
  id: string;

  @ApiProperty({ example: 'Naing', description: 'Full name of the user' })
  name: string;

  @ApiProperty({
    example: 'naing@example.com',
    description: 'Email of the user',
  })
  email: string;

  @ApiProperty({ description: 'Date the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'Date the user was last updated' })
  updatedAt: Date;
}
