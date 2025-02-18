import * as basicAuth from 'express-basic-auth';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { SWAGGER_CONFIG } from '@config/swagger.config';

export function createDocument(app: INestApplication) {
  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .addBearerAuth()
    .setDescription(SWAGGER_CONFIG.description)
    .setVersion(SWAGGER_CONFIG.version);
  SWAGGER_CONFIG.tags.forEach((tag) => {
    builder.addTag(tag);
  });
  const configService = app.get(ConfigService);
  const options = builder.build();
  const username = configService.get<string>('swagger.username') ?? 'username';
  const password = configService.get<string>('swagger.password') ?? 'password';
  const appMode = configService.get<string>('app.mode');
  // console.log(appMode)
  if (appMode !== 'development') {
    app.use(
      '/docs',
      basicAuth({
        challenge: true,
        users: { [username]: password },
      }),
    );
  }
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
}
