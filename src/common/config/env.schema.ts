import * as z from 'zod';

export const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test'], {
    error: 'NODE_ENV is required',
  }),
  PORT: z.string({
    error: 'PORT is required',
  }),
  DATABASE_URL: z
    .string({
      error: 'DATABASE_URL is required',
    })
    .nonempty('DATABASE_URL cannot be empty'),
  JWT_SECRET: z
    .string({
      error: 'JWT_SECRET is required',
    })
    .min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('3600s'),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().optional(),
});
