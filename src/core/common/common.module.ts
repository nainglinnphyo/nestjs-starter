/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
/* eslint-disable import/order */
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import configs from '@config/index';
import { PrismaModule } from '@shared/prisma/prisma.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    PrismaModule,
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
      expandVariables: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default('3000').required(),
        AUTH_JWT_ACCESS_TOKEN_EXPIRED: Joi.string().default('15m').required(),
        AUTH_JWT_ACCESS_TOKEN_SECRET_KEY: Joi.string().alphanum().min(5).max(50).required(),
        AUTH_JWT_REFRESH_TOKEN_EXPIRED: Joi.string().default('182d').required(),
        AUTH_JWT_REFRESH_TOKEN_SECRET_KEY: Joi.string().alphanum().min(5).max(50).required(),

        AUTH_JWT_PAYLOAD_ENCRYPT: Joi.boolean().default(false).required(),
        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY: Joi.string().allow(null, '').min(5).max(50).optional(),
        AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV: Joi.string().allow(null, '').min(5).max(50).optional(),
        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY: Joi.string().allow(null, '').min(5).max(50).optional(),
        AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV: Joi.string().allow(null, '').min(5).max(50).optional(),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
})
export class CommonModule {}
