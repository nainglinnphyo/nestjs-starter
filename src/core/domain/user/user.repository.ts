import { Prisma } from "@prisma/client";
import { User } from "./user.entity";

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;

  abstract findById(id: string): Promise<User | null>;
  abstract findAll(): Promise<User[] | []>;
  abstract save(user: User, tx?: Prisma.TransactionClient): Promise<User>;
}
