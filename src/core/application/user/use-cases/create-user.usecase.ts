import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/user.repository';
import { Email } from '../../../domain/user/user-email.vo';
import { User } from '../../../domain/user/user.entity';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { HttpStatus } from '@nestjs/common';
import { AppException } from 'src/common/exceptions/app.exception';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepo: IUserRepository,
    private readonly prisma: PrismaService,
  ) {}

  async execute(input: { name: string; email: string }) {
    const email = Email.create(input.email);
    const exists = await this.userRepo.findByEmail(email.toString());
    if (exists) {
      throw new AppException(
        {
          code: 'USER_ALREADY_EXISTS',
          message: 'User with this email already exists',
        },
        HttpStatus.CONFLICT,
      );
    }

    const user = User.create({ name: input.name, email });

    const created = await this.prisma.runInTransaction(async () => {
      return await this.userRepo.save(user);
    });

    return UserMapper.toResponse(created);
  }
}
