import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  const options = new DocumentBuilder()
    .setTitle('Skrr REST API')
    .setDescription('Backend Documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'Authorization',
        name: 'JWT',
        in: 'header',
      },
      'access-token'
    )
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
};
