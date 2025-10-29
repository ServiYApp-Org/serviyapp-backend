import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';
import { Region } from '../entities/region.entity';
import { City } from '../entities/city.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LocationsSeed implements OnModuleInit {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,

    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,

    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {}

  async onModuleInit() {
    // Solo ejecuta en desarrollo
    if (process.env.NODE_ENV === 'production') {
      console.log('[LocationsSeed] Entorno de producción, se omite precarga de ubicaciones.');
      return;
    }

    console.log('[LocationsSeed] Verificando datos de ubicación...');

    const count = await this.countryRepo.count();
    if (count > 0) {
      console.log('[LocationsSeed] Datos ya existentes, no se requiere carga.');
      return;
    }

    console.log('[LocationsSeed] Cargando ubicaciones desde JSON...');

    const filePath = path.join('src/modules/locations/seeds/data/locations.json');
    if (!fs.existsSync(filePath)) {
      console.error('[LocationsSeed] No se encontró el archivo locations.json');
      return;
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    for (const countryData of data) {
      const country = this.countryRepo.create({
        name: countryData.name,
        code: countryData.code,
      });
      await this.countryRepo.save(country);

      for (const regionData of countryData.regions) {
        const region = this.regionRepo.create({
          name: regionData.name,
          country,
        });
        await this.regionRepo.save(region);

        const cities = regionData.cities.map((cityName: string) =>
          this.cityRepo.create({ name: cityName, region }),
        );

        await this.cityRepo.save(cities);
      }
    }

    console.log('[LocationsSeed] Países, regiones y ciudades cargadas correctamente.');
  }
}
