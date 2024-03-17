import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller()
export class UserController {
  @Get()
  getUser() {
    return 'get user endpoint';
  }
}
