/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
/* eslint-disable import/order */
// Import external modules
import * as cluster from 'cluster';
import * as os from 'os';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createDocument } from '@core/docs/swagger';
import { WinstonModule } from 'nest-winston';
import { winstonLoggerOptions } from '@config/logger.config';

const logger = new Logger('bootstrap');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger(winstonLoggerOptions),
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  createDocument(app);
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('app.port');
  await app.listen(PORT);
  logger.log(`Application listening on port ${PORT}`);
}

if (process.env.CLUSTERING === 'true') {
  const numCPUs = os.cpus().length;
  if ((cluster as any).isMaster) {
    logger.log(`Master process is running with PID ${process.pid}`);
    for (let i = 0; i < numCPUs; i += 1) {
      (cluster as any).fork();
    }
    (cluster as any).on('exit', (worker, code, signal) => {
      logger.debug(`Worker process ${worker.process.pid} exited with code ${code} and signal ${signal}`);
    });
  } else {
    bootstrap();
  }
} else {
  bootstrap();
}
