import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PrismaUserRepository } from '../repositories/prisma-user.repository';
import { CreateUserUseCase } from '../../application/user/use-cases/create-user.usecase';
import { FindUserUseCase } from '../../application/user/use-cases/find-user.usecase';
import { UserController } from 'src/presentation/user/user.controller';
import { REPOSITORY_TOKEN } from 'src/common/constant/repository.config';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    PrismaUserRepository,
    CreateUserUseCase,
    FindUserUseCase,
    {
      provide: REPOSITORY_TOKEN.USER,
      useExisting: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
