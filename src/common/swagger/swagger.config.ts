import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Fary API')
    .setDescription('API documentation for Fary services')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authorization',
    ) // optional JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Main Swagger path
  SwaggerModule.setup('docs', app, document);

  //   const userDoc = SwaggerModule.createDocument(app, userModuleConfig, { include: [UserModule] });
  // SwaggerModule.setup('api/users', app, userDoc);
}
