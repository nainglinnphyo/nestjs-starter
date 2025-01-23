import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller({
  version: '1',
})
export class UserController {
  @Get()
  getUser() {
    return 'get user endpoint';
  }
}
