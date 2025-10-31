import './common/config/instrument';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { setupSwagger } from './common/swagger/swagger.config';
import { AppConfigService } from './common/config/config.service';
import { SanitizePipe } from './common/pipes/sanitize.pipe';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    forceCloseConnections: true,
  });
  const configService = app.get(AppConfigService);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new TimeoutInterceptor(10000),
    new ResponseInterceptor(),
  );

  app.useGlobalPipes(new ValidationPipe(), new SanitizePipe());

  if (configService.nodeEnv === 'development') {
    setupSwagger(app);
  }

  const port = configService.port;
  await app.listen(port);
  console.log(`🚀 Server running on http://localhost:8090`);
  if (configService.nodeEnv === 'development') {
    console.log(`📚 Swagger docs available at http://localhost:${port}/docs`);
  }
}
bootstrap();
