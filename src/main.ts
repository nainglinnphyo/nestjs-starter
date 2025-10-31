import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { setupSwagger } from './common/swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    // new TransformInterceptor(),
    new TimeoutInterceptor(10000),
    new ResponseInterceptor(),
  );

  app.useGlobalPipes(new ValidationPipe());

  // Swagger setup
  setupSwagger(app);

  await app.listen(8090);
  console.log(`🚀 Server running on http://localhost:8090`);
}
bootstrap();
