import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from '../../core/application/user/dtos/create-user.dto';
import { CreateUserUseCase } from '../../core/application/user/use-cases/create-user.usecase';
import { FindUserUseCase } from '../../core/application/user/use-cases/find-user.usecase';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from 'src/core/application/user/dtos/user-response.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUser: FindUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserResponseDto,
  })
  async create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  async findById(@Param('id') id: string) {
    return this.findUser.execute(id);
  }
}
