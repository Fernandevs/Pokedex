import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Pokedex example')
    .setDescription('This is a Pokedex project developed in nest js')
    .setVersion('1.0')
    .addTag('Pokedex')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v2', app, document);

  app.setGlobalPrefix('api/v2');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );

  await app.listen(process.env.PORT);
}

bootstrap();
