import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';
import { Category } from '../categories/entities/category.entity';
import { Provider } from '../providers/entities/provider.entity';
import { ServicesSeed } from './seeds/services.seeder';
import { ProvidersModule } from '../providers/providers.module';

// Módulo encargado de la gestión de servicios.
// Incluye controladores, servicios, entidades y precarga inicial (seed).
@Module({
  imports: [
    TypeOrmModule.forFeature([Service, Category, Provider]),
    ProvidersModule, // Permite acceder a repositorios y entidades del módulo de proveedores.
  ],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesSeed],
  exports: [ServicesService, TypeOrmModule, ServicesSeed],
})
export class ServicesModule {}
