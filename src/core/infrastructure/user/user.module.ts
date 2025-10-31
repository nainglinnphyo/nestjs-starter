import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.usecase';
import { FindUserUseCase } from '../../application/user/use-cases/find-user.usecase';
import { UserController } from 'src/presentation/user/user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    PrismaUserRepository,
    CreateUserUseCase,
    FindUserUseCase,
    {
      provide: 'IUserRepository',
      useExisting: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
