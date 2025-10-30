import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { Provider } from '../providers/entities/provider.entity';
import { Category } from '../categories/entities/category.entity';
import { ServicesSeed } from './seeds/services.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Provider, Category])],
  controllers: [ServicesController],
  providers: [ServicesService, ServicesSeed],
  exports: [ServicesService],
})
export class ServicesModule {}
