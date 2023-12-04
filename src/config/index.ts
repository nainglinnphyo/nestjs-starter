/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import AuthConfig from './auth.config';
import AppConfigs from './app.config';

// export const configuration = (): Partial<IConfig> => ({
//   env: process.env.NODE_ENV || NodeEnv.DEVELOPMENT,
//   port: parseInt(process.env.PORT, 10) || 3000,
//   host: process.env.HOST || '127.0.0.1',
//   logLevel: process.env.LOG_LEVEL,
//   clustering: process.env.CLUSTERING,
//   app: appConfig(),
//   transmitter: transmitterConfig(),
// });

export default [AuthConfig, AppConfigs];
