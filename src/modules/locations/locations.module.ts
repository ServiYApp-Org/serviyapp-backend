import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { Region } from './entities/region.entity';
import { City } from './entities/city.entity';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { LocationsSeed } from './seeds/locations.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Country, Region, City])],
  controllers: [LocationsController],
  providers: [LocationsService, LocationsSeed],
  exports: [TypeOrmModule, LocationsService],
})
export class LocationsModule {}
