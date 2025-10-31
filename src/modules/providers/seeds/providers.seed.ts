import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

import { Provider } from '../entities/provider.entity';
import { ProviderDocument } from '../entities/provider-document.entity';
import { Schedule } from '../entities/schedule.entity';
import { Country } from 'src/modules/locations/entities/country.entity';
import { Region } from 'src/modules/locations/entities/region.entity';
import { City } from 'src/modules/locations/entities/city.entity';
import { Role } from 'src/modules/auth/roles.enum';

// Servicio de precarga (seed) para proveedores.
// Crea registros iniciales de proveedores, documentos y horarios a partir de un archivo JSON.
@Injectable()
export class ProvidersSeed implements OnModuleInit {
  private readonly logger = new Logger(ProvidersSeed.name);

  constructor(
    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,

    @InjectRepository(ProviderDocument)
    private readonly docRepo: Repository<ProviderDocument>,

    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,

    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,

    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,

    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') return;

    const existing = await this.providerRepo.count();
    if (existing > 0) {
      this.logger.warn('[ProvidersSeed] Proveedores ya existen, se omite precarga.');
      return;
    }

    // Carga del archivo JSON de proveedores
    const filePath = path.join('src/modules/providers/seeds/data/providers.json');
    if (!fs.existsSync(filePath)) {
      this.logger.error(`[ProvidersSeed] No se encontró el archivo providers.json en ${filePath}`);
      return;
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);
    this.logger.log(`[ProvidersSeed] ${data.length} proveedores encontrados en el JSON.`);

    // Carga de ubicaciones registradas
    const countries = await this.countryRepo.find({ relations: ['regions'] });
    if (!countries.length) {
      this.logger.error('No hay países registrados.');
      return;
    }

    for (const p of data) {
      // Selección aleatoria de país, región y ciudad válidos
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      const regions = await this.regionRepo.find({
        where: { country: { id: randomCountry.id } },
        relations: ['cities'],
      });

      if (!regions.length) continue;
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const cities = await this.cityRepo.find({ where: { region: { id: randomRegion.id } } });
      if (!cities.length) continue;
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      // Creación del proveedor
      const provider = this.providerRepo.create({
        names: p.names,
        surnames: p.surnames,
        userName: p.userName,
        email: p.email,
        phone: String(p.phone),
        password: await bcrypt.hash(p.password, 10),
        address: p.address,
        profilePicture: p.profilePicture ?? null,
        role: Role.Provider,
        status: 'active',
        isCompleted: true,
        registrationDate: new Date(),
        country: randomCountry,
        region: randomRegion,
        city: randomCity,
      });

      const savedProvider = await this.providerRepo.save(provider);

      // Creación del documento asociado
      const document = this.docRepo.create({
        provider: savedProvider,
        documentType: 'ID',
        documentNumber: p.documentNumber ?? '123456789',
        file: p.documentFile ?? 'https://example.com/doc.pdf',
        date: new Date(),
        status: 'approved',
        description: 'Documento de identidad',
        accountType: 'Savings',
        accountNumber: '000111222',
        bank: 'Bancolombia',
        accountFile: 'https://example.com/account.pdf',
      });

      await this.docRepo.save(document);

      // Creación de horarios base (lunes a viernes)
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
      const schedules = days.map((d) =>
        this.scheduleRepo.create({
          day: d,
          startTime: '09:00',
          endTime: '18:00',
          status: 'active',
          provider: savedProvider,
        }),
      );
      await this.scheduleRepo.save(schedules);

      this.logger.log(`Proveedor creado: ${savedProvider.names} (${savedProvider.email})`);
    }

    this.logger.log('[ProvidersSeed] Proveedores, documentos y horarios creados correctamente.');
  }
}
