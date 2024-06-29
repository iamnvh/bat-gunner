import {
  ClassSerializerInterceptor,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import validationOptions from './utils/validation-options';
import { ConfigService } from '@nestjs/config';
import { json, urlencoded } from 'express';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule, {
    cors: { origin: process.env.FRONTEND_DOMAIN },
  });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('app.apiPrefix') as string, {
    exclude: ['/'],
  });
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalPipes(new ValidationPipe(validationOptions));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API docs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document, {
    customJs: `/docs/swagger-ui-init.js?v=${new Date().getTime()}`,
  });

  await app.listen(configService.get('app.port') as string);
}
void bootstrap();
