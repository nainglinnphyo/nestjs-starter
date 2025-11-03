import { User } from "@domain/user/user.entity";
import { UserResponseDto } from "@application/user/dtos/user-response.dto";

export class UserMapper {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id!,
      name: user.name,
      email: user.email.getValue(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}
