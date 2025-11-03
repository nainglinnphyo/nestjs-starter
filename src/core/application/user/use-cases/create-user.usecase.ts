import { REPOSITORY_TOKEN } from "@constant/repository.config";
import { User } from "@domain/user/user.entity";
import { UserRepository } from "@domain/user/user.repository";
import { Email } from "@domain/user/value-objects/user-email.vo";
import { ERROR_CODES } from "@errors/errors.code";
import { ConflictException } from "@exceptions/conflict.exception";
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { Inject, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UserMapper } from "@application/user/mapper/user.mapper";

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.USER) private readonly userRepo: UserRepository,
    private readonly prisma: PrismaService
  ) {}

  async execute(input: { name: string; email: string }) {
    const email = Email.create(input.email);
    const exists = await this.userRepo.findByEmail(email.getValue());
    if (exists) {
      throw new ConflictException(
        ERROR_CODES.CONFLICT_EMAIL,
        "User with this email already exists"
      );
    }

    const user = User.create({ name: input.name, email });

    const created = await this.prisma.runInTransaction(
      async (tx?: Prisma.TransactionClient) => {
        return await this.userRepo.save(user, tx);
      }
    );
    return UserMapper.toResponse(created);
  }
}
