/* eslint-disable sort-imports-es6-autofix/sort-imports-es6 */
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CommonModule } from '@core/common/common.module';
import { MiddlewareConsumer, Module, ValidationError, ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter, BadRequestExceptionFilter } from '@core/filters';
import { NotFoundExceptionFilter } from '@core/filters/not-found.exception-filter';
import { RequestLoggerMiddleware } from '@core/middleware/logging.middleware';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainModule } from './modules/main.module';

@Module({
  imports: [CommonModule, MainModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: BadRequestExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          exceptionFactory: (errors: ValidationError[]) => {
            return errors[0];
          },
        }),
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
