/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
/* eslint-disable import/order */
// Import external modules
import * as cluster from 'cluster';
import * as os from 'os';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerOptions } from '@config/swagger.config';
import { ResponseInterceptor } from '@core/interceptors/transform.interceptor';

const logger = new Logger('bootstrap');
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ResponseInterceptor());
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
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
