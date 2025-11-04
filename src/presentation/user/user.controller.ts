import { CreateUserDto } from "@application/user/dtos/create-user.dto";
import { UserResponseDto } from "@application/user/dtos/user-response.dto";
import { CreateUserUseCase } from "@application/user/use-cases/create-user.usecase";
import { FindAllUserUseCase } from "@application/user/use-cases/find-all-user.usecase";
import { FindUserUseCase } from "@application/user/use-cases/find-user.usecase";
import {
  ApiCustomResponse,
  ApiPaginatedResponse,
} from "@dto/response/response.dto";
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";

@Controller("users")
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUser: FindUserUseCase,
    private readonly findAllUser: FindAllUserUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({
    status: 201,
    description: "User successfully created",
    type: UserResponseDto,
  })
  async create(@Body() dto: CreateUserDto): Promise<UserResponseDto> {
    return this.createUser.execute(dto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiCustomResponse(UserResponseDto)
  async findById(@Param("id") id: string): Promise<UserResponseDto> {
    return this.findUser.execute(id);
  }

  @Get("")
  @ApiOperation({ summary: "Get all user" })
  @ApiPaginatedResponse(UserResponseDto)
  async findAll(): Promise<UserResponseDto[]> {
    return this.findAllUser.execute();
  }
}
