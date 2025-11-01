import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Provider } from '../providers/entities/provider.entity';
import { Category } from '../categories/entities/category.entity';

// Servicio encargado de la lógica de negocio de los servicios.
// Gestiona la creación, consulta, actualización y eliminación de servicios.
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,

    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Crear un nuevo servicio asociado a un proveedor y categoría.
  async create(dto: CreateServiceDto): Promise<Service> {
    const provider = await this.providerRepository.findOne({
      where: { id: dto.providerId },
    });
    if (!provider) throw new NotFoundException('Proveedor no encontrado');

    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Categoría no encontrada');

    const service = this.serviceRepository.create({
      name: dto.name,
      description: dto.description,
      photo: dto.photo,
      status: dto.status ?? true,
      duration: dto.duration,
      provider,
      category,
    });

    return await this.serviceRepository.save(service);
  }

  // Obtener todos los servicios registrados.
  async findAll(): Promise<Service[]> {
    return await this.serviceRepository.find({
      relations: ['provider', 'category'],
      order: { createdAt: 'DESC' },
    });
  }

  // Obtener un servicio por su ID.
  async findOne(id: string): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['provider', 'category'],
    });
    if (!service) throw new NotFoundException(`Servicio con ID ${id} no encontrado`);
    return service;
  }

  // Actualizar un servicio existente.
  async update(id: string, dto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);

    if (dto.providerId) {
      const provider = await this.providerRepository.findOne({
        where: { id: dto.providerId },
      });
      if (!provider) throw new NotFoundException('Proveedor no encontrado');
      service.provider = provider;
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Categoría no encontrada');
      service.category = category;
    }

    Object.assign(service, dto);
    return await this.serviceRepository.save(service);
  }

  // Eliminar un servicio por su ID.
  async remove(id: string): Promise<void> {
    const service = await this.findOne(id);
    await this.serviceRepository.remove(service);
  }
}
