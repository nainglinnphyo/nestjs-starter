import { Prisma } from '@prisma/client';
import { User } from './user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  save(user: User, tx?: Prisma.TransactionClient): Promise<User>;
}
