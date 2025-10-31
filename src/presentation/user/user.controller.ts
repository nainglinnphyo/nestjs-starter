import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from '../../core/application/user/dtos/create-user.dto';
import { CreateUserUseCase } from '../../core/application/user/use-cases/create-user.usecase';
import { FindUserUseCase } from '../../core/application/user/use-cases/find-user.usecase';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUser: FindUserUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.findUser.execute(id);
  }
}
