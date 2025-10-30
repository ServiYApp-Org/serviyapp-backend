import { Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Service } from "../entities/service.entity";
import { Repository } from "typeorm";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ServicesSeed implements OnModuleInit {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepo: Repository<Service>,
    ) {}

async onModuleInit() {
        // Evita la ejecucion en Produccion
        if (process.env.NODE_ENV === 'production') {
            console.log('[ServicesSeed] Entorno de producción, se omite precarga de Servicios.')
            return;
        }

        const count = await this.serviceRepo.count();
        if (count > 0) {
        console.log('[ServicesSeed] Servicios ya existentes, no se requiere carga.');
        return;
        }

        console.log('[ServicesSeed] Cargando Servicios desde JSON...');

        const filePath = path.join('src/modules/services/seeds/data/services.json');
        if (!fs.existsSync(filePath)) {
            console.error('[ServicesSeed] No se encontró el archivo services.json');
            return;
        }

        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);

        const services = data.map((service: any) => 
            this.serviceRepo.create({
                name: service.name,
                description: service.description,
                photo: service.photo,
                status: service.status,
                duration: service.duration,
                createdAt: service.createdAt,
            }),
        );

        await this.serviceRepo.save(services)
        console.log(`[ServicesSeed] Se cargaron ${services.length} Servicios correctamente.`);
    }
}