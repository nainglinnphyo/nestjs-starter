import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './core/infrastructure/user/user.module';
import { PrismaModule } from './core/infrastructure/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './common/config/env.schema';
import { AppConfigService } from './common/config/config.service';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (env) => {
        const parsed = EnvSchema.safeParse(env);
        if (!parsed.success) {
          // Collect readable error messages
          const errors = Object.values(parsed.error.format())
            .map((e: any) => e?._errors?.join(', '))
            .filter(Boolean)
            .join('; ');
          throw new Error(`Environment validation failed: ${errors}`);
        }
        return parsed.data;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppConfigService],
  exports: [AppConfigService],
})
export class AppModule {}
