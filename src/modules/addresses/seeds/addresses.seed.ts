import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../entities/address.entity';
import { Country } from 'src/modules/locations/entities/country.entity';
import { Region } from 'src/modules/locations/entities/region.entity';
import { City } from 'src/modules/locations/entities/city.entity';
import { User } from 'src/modules/users/entities/user.entity';

// Servicio para generar direcciones iniciales al iniciar el módulo.
@Injectable()
export class AddressesSeed implements OnModuleInit {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,

    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,

    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  // Se ejecuta al iniciar el módulo. Genera direcciones de ejemplo para usuarios si no existen.
  async onModuleInit() {
    // Evita ejecución en entorno de producción
    if (process.env.NODE_ENV === 'production') {
      console.log('[AddressesSeed] Entorno de producción, se omite precarga.');
      return;
    }

    // Verifica si ya existen direcciones
    const count = await this.addressRepo.count();
    if (count > 0) {
      console.log('[AddressesSeed] Direcciones ya existentes, se omite.');
      return;
    }

    console.log('[AddressesSeed] Creando direcciones basadas en ubicaciones reales...');

    // Obtiene países con sus regiones
    const countries = await this.countryRepo.find({ relations: ['regions'] });
    if (!countries.length) {
      console.error('[AddressesSeed] No hay países cargados.');
      return;
    }

    // Obtiene usuarios registrados
    const users = await this.userRepo.find();
    if (!users.length) {
      console.log('[AddressesSeed] No hay usuarios registrados aún.');
      return;
    }

    // Asigna ubicaciones aleatorias y crea una dirección para cada usuario
    for (const user of users) {
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];

      const regions = await this.regionRepo.find({
        where: { country: { id: randomCountry.id } },
      });
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];

      const cities = await this.cityRepo.find({
        where: { region: { id: randomRegion.id } },
      });
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      const newAddress = this.addressRepo.create({
        name: 'Casa',
        address: 'Dirección principal del usuario',
        neighborhood: 'Centro',
        buildingType: 'Apartamento',
        comments: 'Dirección generada automáticamente',
        status: true,
        country: randomCountry,
        region: randomRegion,
        city: randomCity,
        user,
      });

      await this.addressRepo.save(newAddress);

      console.log(
        `Dirección creada para ${user.names}: ${randomCity.name}, ${randomRegion.name}, ${randomCountry.name}`,
      );
    }

    console.log(`[AddressesSeed] Se crearon ${users.length} direcciones correctamente.`);
  }
}
