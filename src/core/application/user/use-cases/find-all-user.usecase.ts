import { REPOSITORY_TOKEN } from "@constant/repository.config";
import { UserRepository } from "@domain/user/user.repository";
import { NotFoundException } from "@exceptions/not-found.exception";
import { UserMapper } from "@application/user/mapper/user.mapper";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class FindAllUserUseCase {
  constructor(
    @Inject(REPOSITORY_TOKEN.USER) private readonly userRepo: UserRepository
  ) {}

  async execute() {
    const user = await this.userRepo.findAll();
    if (!user) throw new NotFoundException("USER_NOT_FOUND", "User not found");
    return UserMapper.toListResponse(user);
  }
}
