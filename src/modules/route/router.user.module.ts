import { Module } from '@nestjs/common';
import { UserController } from '../user/user.controller';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [UserController],
  providers: [],
  exports: [],
  imports: [UserModule],
})
export class RoutesUserModule {}
