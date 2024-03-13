import { NodeEnv } from 'src/shared/enums';
import { registerAs } from '@nestjs/config';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    port: process.env.PORT || 3000,
    mode: process.env.NODE_ENV || NodeEnv.DEVELOPMENT,
    dbUrl: process.env.DATABASE_URL,
    globalPrefix: '/api',
  }),
);
