import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggerGlobal } from './middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerDoc = new DocumentBuilder()
    .setTitle('ServiYApp | Documentacion API')
    .setDescription('ServiYApp — API para gestionar usuarios, proveedores, servicios y reservas. Proporciona endpoints para registro y autenticación (JWT), gestión de roles y permisos, CRUD de proveedores, servicios, órdenes de servicio, direcciones y ubicaciones (países, regiones, ciudades). Incluye paginación, filtros, validaciones y ejemplos de request/response; muchas rutas están protegidas con Bearer JWT y controles de roles. Usa esta documentación para explorar esquemas DTO, probar endpoints y entender las reglas de autenticación y autorización.')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const documentModule = SwaggerModule.createDocument(app, swaggerDoc);
  SwaggerModule.setup('docs', app, documentModule)

  app.use(LoggerGlobal);

  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.get('/', (req, res) => {
    res.redirect('/docs');
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
