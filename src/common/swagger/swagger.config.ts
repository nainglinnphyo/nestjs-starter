import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Sets up Swagger documentation for the API
 * Only enabled in non-production environments by default
 */
export const setupSwagger = (app: INestApplication): void => {
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get('NODE_ENV');
  const isProduction = nodeEnv === 'production';

  // Only enable Swagger in non-production environments unless explicitly configured
  if (isProduction && !configService.get('SWAGGER_ENABLED')) {
    return;
  }

  const options = new DocumentBuilder()
    .setTitle('NestJS Starter Kit API Documentation')
    .setVersion('2.0.0')
    // .setContact(
    //   'NestJS Starter Kit Team',
    //   'https://github.com/your-organization/nest-starter-kit',
    //   'contact@example.com',
    // )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addServer(
      `http://localhost:${configService.get('PORT')}`,
      'Local Development',
    )
    // .addTag('Authentication', 'User authentication and authorization endpoints')
    // .addTag('Users', 'User management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-KEY',
        in: 'header',
        description: 'API Key for authentication',
      },
      'api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  });

  // Add custom Swagger configuration
  SwaggerModule.setup('/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'list',
      filter: true,
      showCommonExtensions: true,
      syntaxHighlight: {
        theme: 'monokai',
      },
      tryItOutEnabled: true,
      defaultModelsExpandDepth: 3,
      defaultModelExpandDepth: 3,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    // customSiteTitle: 'NestJS Starter Kit API Documentation',
    // customfavIcon: 'https://nestjs.com/img/favicon.png',
    // customJs: [
    //   'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.8/swagger-ui-bundle.min.js',
    // ],
    // customCssUrl: [
    //   'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.11.8/swagger-ui.min.css',
    // ],
  });
};
