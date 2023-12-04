import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerOptions = new DocumentBuilder()
  .setTitle('NestJS Starter API')
  .setDescription('The API for the NestJS Starter project')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
