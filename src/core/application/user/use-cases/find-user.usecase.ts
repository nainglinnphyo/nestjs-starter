import { REPOSITORY_TOKEN } from "@constant/repository.config";
import { UserRepository } from "@domain/user/user.repository";
import { NotFoundException } from "@exceptions/not-found.exception";
import { UserMapper } from "@application/user/mapper/user.mapper";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FindUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.USER) private readonly userRepo: UserRepository
  ) {}

  async execute(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundException("USER_NOT_FOUND", "User not found");
    return UserMapper.toResponse(user);
  }
}
