import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Service } from '../entities/service.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Provider } from 'src/modules/providers/entities/provider.entity';

@Injectable()
export class ServicesSeed implements OnModuleInit {
  private readonly logger = new Logger(ServicesSeed.name);

  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,
  ) {}

  async onModuleInit() {
    if (process.env.SEED_ON_START !== 'true') {
      this.logger.log('[ServicesSeed] SEED_ON_START=false → no se ejecuta el seed.');
      return;
    }

    const count = await this.serviceRepo.count();
    if (count > 0) {
      this.logger.warn('[ServicesSeed] Servicios ya existen, se omite precarga.');
      return;
    }

    const filePath = path.join('src/modules/services/seeds/data/services.json');
    if (!fs.existsSync(filePath)) {
      this.logger.error(`[ServicesSeed] No se encontró el archivo services.json en ${filePath}`);
      return;
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);
    this.logger.log(`[ServicesSeed] ${data.length} servicios encontrados en el JSON.`);

    const categories = await this.categoryRepo.find();
    const providers = await this.providerRepo.find();

    if (!categories.length || !providers.length) {
      this.logger.error('[ServicesSeed] Faltan categorías o proveedores en la base.');
      return;
    }

    for (const s of data) {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomProvider = providers[Math.floor(Math.random() * providers.length)];

      const service = this.serviceRepo.create({
        name: s.name,
        description: s.description,
        photo: s.photo,
        status: s.status,
        duration: s.duration,
        createdAt: new Date(),
        category: randomCategory,
        provider: randomProvider,
      });

      await this.serviceRepo.save(service);
      this.logger.log(`✅ Servicio creado: ${s.name} → ${randomProvider.names}`);
    }

    this.logger.log('[ServicesSeed] Servicios creados correctamente.');
  }
}
