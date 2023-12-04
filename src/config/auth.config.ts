/* eslint-disable no-unneeded-ternary */
import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    accessToken: {
      secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY ?? '123456',
      expirationTime: process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED ?? '1h', // 1 hours

      encryptKey: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY,
      encryptIv: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV,
    },

    refreshToken: {
      secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY ?? '123456000',
      expirationTime: process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED ?? '182d', // 1 hours

      encryptKey: process.env.AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY,
      encryptIv: process.env.AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV,
    },

    password: {
      attempt: false,
      maxAttempt: 5,
      saltLength: 8,
      expiredIn: '182d', // 182 days
    },
  }),
);
