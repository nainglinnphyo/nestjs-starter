# NestJS DDD + Prisma Scaffold (Large-scale)

> A compact, production-minded scaffold showing folder structure and example files for a large, DDD-styled NestJS project using Prisma, transactions, custom exceptions, pipes, guards, interceptors, value objects, repositories, and use-cases.

---

## Project layout (recommended)

```
src/
├─ main.ts
├─ infrastructure/
│  ├─ prisma/
│  │  ├─ prisma.service.ts
│  │  └─ prisma.module.ts
│  ├─ web/
│  │  └─ controllers/
│  └─ logger/
├─ modules/
│  └─ user/
│     ├─ application/
│     │  ├─ dtos/
│     │  ├─ use-cases/
│     │  │  └─ create-user.usecase.ts
│     │  └─ services/
│     ├─ domain/
│     │  ├─ entities/
│     │  │  └─ user.entity.ts
│     │  ├─ value-objects/
│     │  │  └─ email.vo.ts
│     │  ├─ repositories/
│     │  │  └─ user.repository.ts
│     │  └─ exceptions/
│     ├─ infrastructure/
│     │  └─ prisma-user.repository.ts
│     └─ web/
│        ├─ controllers/
│        │  └─ user.controller.ts
│        └─ dtos/
└─ common/
   ├─ errors/
   │  └─ business.exception.ts
   ├─ filters/
   │  └─ http-exception.filter.ts
   ├─ interceptors/
   │  └─ logging.interceptor.ts
   ├─ pipes/
   │  └─ validation.pipe.ts
   ├─ guards/
   │  └─ auth.guard.ts
   └─ transactions/
      └─ transaction.manager.ts
```

---

## Important patterns shown

- **Domain**: Entities, Value Objects, Domain Errors, Repository Interfaces.
- **Application**: DTOs, UseCases (single execute method), Application Services.
- **Infrastructure**: Prisma implementation of repositories and a `PrismaService` with transaction helpers.
- **Web**: Controllers that map HTTP -> UseCases via DTO validation.
- **Cross-cutting**: Global Validation Pipe, Exception Filter, Logging Interceptor, Auth Guard, Transaction Manager.

---

### `src/infrastructure/prisma/prisma.service.ts`
```ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  // convenience helper: run a function inside a transaction
  async runInTransaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T> {
    return await this.$transaction(async (prismaTx) => {
      return fn(prismaTx as unknown as PrismaClient);
    });
  }
}
```

### `src/common/errors/business.exception.ts`
```ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessException extends HttpException {
  constructor(message: string, status = HttpStatus.BAD_REQUEST) {
    super({ message }, status);
  }
}
```

### `src/common/filters/http-exception.filter.ts`
```ts
import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();
      response.status(status).json({
        ...payload,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
      return;
    }

    // Unknown errors
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

### `src/common/interceptors/logging.interceptor.ts`
```ts
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        console.log(`${req.method} ${req.url} ${ms}ms`);
      }),
    );
  }
}
```

### `src/common/pipes/validation.pipe.ts`
```ts
import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validateOrReject, plainToInstance } from 'class-transformer';
import { ValidationError } from 'class-validator';

@Injectable()
export class AppValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) return value;
    const object = plainToInstance(metatype, value);
    try {
      await validateOrReject(object, { whitelist: true, forbidNonWhitelisted: true });
    } catch (errors) {
      const messages = (errors as ValidationError[]).map(e => Object.values(e.constraints || {}).join(', ')).join('; ');
      throw new BadRequestException(messages);
    }
    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

### `src/common/guards/auth.guard.ts`
```ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    // simple example: check header
    const token = req.headers['authorization'];
    if (!token) throw new UnauthorizedException('Missing auth token');
    // TODO: validate token properly e.g. JWT validate
    return true;
  }
}
```

### `src/modules/user/domain/value-objects/email.vo.ts`
```ts
export class EmailVO {
  private constructor(private readonly value: string) {}

  static create(email: string): EmailVO {
    // simple validation; replace with more robust regex if needed
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new Error('Invalid email');
    }
    return new EmailVO(email.toLowerCase());
  }

  getValue(): string {
    return this.value;
  }
}
```

### `src/modules/user/domain/entities/user.entity.ts`
```ts
import { EmailVO } from '../value-objects/email.vo';
import { UniqueEntityID } from '../../../shared/unique-entity-id';

export class User {
  constructor(
    public readonly id: UniqueEntityID,
    public email: EmailVO,
    public name: string,
  ) {}

  changeName(name: string) {
    this.name = name;
  }
}
```

> Note: `UniqueEntityID` can be a small wrapper for `string`/`uuid` stored in `shared/`.

### `src/modules/user/domain/repositories/user.repository.ts`
```ts
import { User } from '../entities/user.entity';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<void>;
}
```

### `src/modules/user/infrastructure/prisma-user.repository.ts`
```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { IUserRepository } from '../domain/repositories/user.repository';
import { User } from '../domain/entities/user.entity';
import { EmailVO } from '../domain/value-objects/email.vo';
import { UniqueEntityID } from '../../../shared/unique-entity-id';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    const row = await this.prisma.user.findUnique({ where: { email } });
    if (!row) return null;
    return new User(new UniqueEntityID(row.id), EmailVO.create(row.email), row.name);
  }

  async save(user: User) {
    await this.prisma.user.upsert({
      where: { id: user.id.toString() },
      create: { id: user.id.toString(), email: user.email.getValue(), name: user.name },
      update: { email: user.email.getValue(), name: user.name },
    });
  }
}
```

### `src/modules/user/application/dtos/create-user.dto.ts`
```ts
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;
}
```

### `src/modules/user/application/use-cases/create-user.usecase.ts`
```ts
import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { EmailVO } from '../../domain/value-objects/email.vo';
import { UniqueEntityID } from '../../../shared/unique-entity-id';
import { BusinessException } from '../../../common/errors/business.exception';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepo: IUserRepository) {}

  async execute(input: { email: string; name: string }) {
    const emailVO = EmailVO.create(input.email);
    const existing = await this.userRepo.findByEmail(emailVO.getValue());
    if (existing) throw new BusinessException('User already exists', 409);

    const user = new (await import('../../domain/entities/user.entity')).User(
      new UniqueEntityID(),
      emailVO,
      input.name,
    );

    await this.userRepo.save(user);

    return { id: user.id.toString(), email: user.email.getValue(), name: user.name };
  }
}
```

### `src/modules/user/web/controllers/user.controller.ts`
```ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from '../../application/dtos/create-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.usecase';

@Controller('users')
export class UserController {
  constructor(private readonly createUser: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }
}
```

### `src/common/transactions/transaction.manager.ts`
```ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/prisma/prisma.service';

@Injectable()
export class TransactionManager {
  constructor(private readonly prisma: PrismaService) {}

  async withTransaction<T>(fn: (tx: typeof this.prisma) => Promise<T>): Promise<T> {
    return this.prisma.runInTransaction(fn);
  }
}
```

> Use `TransactionManager` inside an application service when you need to compose multiple repository calls atomically.

### `src/main.ts`
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppValidationPipe } from './common/pipes/validation.pipe';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new AppValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(3000);
}
bootstrap();
```

---

## Notes & best practices

- **Single Responsibility**: Keep domain code free from Nest-specific decorators where possible; domain should be plain TS classes.
- **Repository Interfaces**: Depend on interfaces in application/domain; bind implementations in module providers (DI).
- **Transactions**: Use `Prisma.$transaction` or a `TransactionManager` to coordinate multiple writes. Avoid long-running transactions.
- **Validation**: Use DTOs + class-validator for inbound data and Value Objects for domain-level invariants.
- **Exceptions**: Use typed Business exceptions for domain errors and convert them to suitable HTTP statuses in filters.
- **Testing**: Write unit tests for UseCases and repositories (mock Prisma for unit tests, use sqlite/docker for integration tests).
