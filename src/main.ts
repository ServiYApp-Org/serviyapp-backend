/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerDoc = new DocumentBuilder()
    .setTitle('ServiYApp | Documentacion de API')
    .setDescription(
      'API para la gestión de servicios, usuarios y reservas en la plataforma ServiYApp. Incluye endpoints para autenticación, administración y operaciones de servicios.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const documentModule = SwaggerModule.createDocument(app, swaggerDoc);
  SwaggerModule.setup('docs', app, documentModule);

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
