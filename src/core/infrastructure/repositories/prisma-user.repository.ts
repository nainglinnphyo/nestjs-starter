import { User } from "@domain/user/user.entity";
import { UserRepository } from "@domain/user/user.repository";
import { Email } from "@domain/user/value-objects/user-email.vo";
import { PrismaService } from "@infrastructure/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { email } });
    return record ? this.toDomain(record) : null;
  }

  async findById(id: string): Promise<User | null> {
    const record = await this.prisma.user.findUnique({ where: { id } });
    return record ? this.toDomain(record) : null;
  }

  async save(user: User, tx?: Prisma.TransactionClient): Promise<User> {
    const data = user.toPrimitives();
    const record = await (tx || this.prisma).user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
      },
    });
    return this.toDomain(record);
  }

  private toDomain(record: any): User {
    return User.create({
      id: record.id,
      name: record.name,
      email: Email.create(record.email),
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
