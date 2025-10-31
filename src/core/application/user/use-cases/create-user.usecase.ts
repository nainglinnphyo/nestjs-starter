import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/user.repository';
import { Email } from '../../../domain/user/value-objects/user-email.vo';
import { User } from '../../../domain/user/user.entity';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { UserMapper } from '../mapper/user.mapper';
import { REPOSITORY_TOKEN } from 'src/common/config/repository.config';
import { ERROR_CODES } from 'src/common/errors/errors.code';
import { ConflictException } from 'src/common/exceptions/conflict.exception';
import { Prisma } from '@prisma/client';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.USER) private readonly userRepo: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: { name: string; email: string }) {
    const email = Email.create(input.email);
    const exists = await this.userRepo.findByEmail(email.getValue());
    if (exists) {
      throw new ConflictException(
        ERROR_CODES.CONFLICT_EMAIL,
        'User with this email already exists',
      );
    }

    const user = User.create({ name: input.name, email });

    const created = await this.prisma.runInTransaction(
      async (tx?: Prisma.TransactionClient) => {
        return await this.userRepo.save(user, tx);
      },
    );
    return UserMapper.toResponse(created);
  }
}
