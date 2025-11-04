import { CreateUserUseCase } from "@application/user/use-cases/create-user.usecase";
import { FindAllUserUseCase } from "@application/user/use-cases/find-all-user.usecase";
import { FindUserUseCase } from "@application/user/use-cases/find-user.usecase";
import { REPOSITORY_TOKEN } from "@constant/repository.config";
import { PrismaModule } from "@infrastructure/prisma/prisma.module";
import { PrismaUserRepository } from "@infrastructure/repositories/prisma-user.repository";
import { Module } from "@nestjs/common";
import { UserController } from "@presentation/user/user.controller";

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    PrismaUserRepository,
    CreateUserUseCase,
    FindUserUseCase,
    FindAllUserUseCase,
    {
      provide: REPOSITORY_TOKEN.USER,
      useExisting: PrismaUserRepository,
    },
  ],
})
export class UserModule {}
