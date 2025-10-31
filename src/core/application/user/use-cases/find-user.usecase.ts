import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/user/user.repository';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { UserMapper } from '../mapper/user.mapper';
import { REPOSITORY_TOKEN } from 'src/common/config/repository.config';

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.USER) private readonly userRepo: IUserRepository,
  ) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException('USER_NOT_FOUND', 'User not found');
    return UserMapper.toResponse(user);
  }
}
