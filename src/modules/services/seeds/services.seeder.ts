import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { Category } from 'src/modules/categories/entities/category.entity';
import { Provider } from 'src/modules/providers/entities/provider.entity';
import { Schedule } from 'src/modules/providers/entities/schedule.entity';
import * as fs from 'fs';
import * as path from 'path';
import { ScheduleStatus } from 'src/modules/providers/enums/schedule-status.enum';

// Servicio de precarga (seed) para los servicios.
// Genera registros iniciales de servicios y horarios asociados a los proveedores.
@Injectable()
export class ServicesSeed implements OnModuleInit {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,

    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,

    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,

    @InjectRepository(Schedule)
    private readonly scheduleRepo: Repository<Schedule>,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') {
      console.log('[ServicesSeed] Entorno de producción, se omite precarga.');
      return;
    }

    const serviceCount = await this.serviceRepo.count();
    if (serviceCount > 0) {
      console.log('[ServicesSeed] Servicios ya existentes, se omite carga.');
      return;
    }

    console.log('[ServicesSeed] Iniciando carga automática de servicios y horarios...');

    const categories = await this.categoryRepo.find();
    const providers = await this.providerRepo.find();

    if (!categories.length || !providers.length) {
      console.warn('[ServicesSeed] No hay categorías o proveedores disponibles.');
      return;
    }

    // Generar horarios base por proveedor.
    console.log('[ServicesSeed] Generando horarios...');
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const schedulesToSave: Schedule[] = [];

    for (const provider of providers) {
      for (const day of daysOfWeek) {
        const startHour = 8 + Math.floor(Math.random() * 2); // 8 o 9
        const endHour = 17 + Math.floor(Math.random() * 2); // 17 o 18

        const schedule = this.scheduleRepo.create({
          day,
          startTime: `${startHour.toString().padStart(2, '0')}:00`,
          endTime: `${endHour.toString().padStart(2, '0')}:00`,
          status: ScheduleStatus.ACTIVE,
          provider,
        });

        schedulesToSave.push(schedule);
      }
    }

    await this.scheduleRepo.save(schedulesToSave);
    console.log(`[ServicesSeed] ${schedulesToSave.length} horarios generados.`);

    // Cargar servicios desde archivo JSON.
    const filePath = path.join('src/modules/services/seeds/data/services.json');
    if (!fs.existsSync(filePath)) {
      console.error('[ServicesSeed] No se encontró el archivo services.json');
      return;
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const servicesData = JSON.parse(rawData);

    const servicesToCreate = servicesData.map((service: any) => {
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const randomProvider = providers[Math.floor(Math.random() * providers.length)];

      return this.serviceRepo.create({
        name: service.name,
        description: service.description,
        photo: service.photo,
        status: service.status,
        duration: service.duration,
        createdAt: service.createdAt ? new Date(service.createdAt) : new Date(),
        category: randomCategory,
        provider: randomProvider,
      });
    });

    await this.serviceRepo.save(servicesToCreate);

    console.log(
      `[ServicesSeed] ${servicesToCreate.length} servicios creados y asociados con categorías y proveedores.`,
    );

    console.log('[ServicesSeed] Seed completado exitosamente.');
  }
}
