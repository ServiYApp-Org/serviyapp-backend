import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CategoriesSeed implements OnModuleInit {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async onModuleInit() {
    // Evitar ejecución en producción
    if (process.env.NODE_ENV === 'production') {
      console.log('[CategoriesSeed] Entorno de producción, se omite precarga de categorías.');
      return;
    }

    console.log('[CategoriesSeed] Verificando categorías iniciales...');

    const count = await this.categoryRepo.count();
    if (count > 0) {
      console.log('[CategoriesSeed] Categorías ya existentes, no se requiere carga.');
      return;
    }

    console.log('[CategoriesSeed] Cargando categorías desde JSON...');

    const filePath = path.join('src/modules/categories/seeds/data/categories.json');
    if (!fs.existsSync(filePath)) {
      console.error('[CategoriesSeed] No se encontró el archivo categories.json');
      return;
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);

    const categories = data.map((item: any) =>
      this.categoryRepo.create({
        name: item.name,
        description: item.description,
        status: true,
      }),
    );

    await this.categoryRepo.save(categories);
    console.log(`[CategoriesSeed] Se cargaron ${categories.length} categorías correctamente.`);
  }
}
