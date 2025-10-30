import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  // Buscar por correo
  async findByEmail(email: string): Promise<Provider | null> {
    if (!email) return null;
    return this.providerRepository.findOne({
      where: { email: email.trim().toLowerCase() },
    });
  }

  // Crear nuevo proveedor (usado por AuthService)
  async create(data: Partial<Provider>): Promise<Provider> {
    const newProvider = this.providerRepository.create(data);
    return this.providerRepository.save(newProvider);
  }

  // Obtener todos los proveedores
  async findAll(): Promise<Provider[]> {
    return this.providerRepository.find({
      order: { registrationDate: 'DESC' },
      relations: ['country', 'region', 'city'], // si tus entidades están relacionadas
    });
  }

  // Obtener proveedor por ID
  async findOne(id: string): Promise<Provider> {
    const provider = await this.providerRepository.findOne({
      where: { id },
      relations: ['country', 'region', 'city'],
    });
    if (!provider) throw new NotFoundException(`Proveedor con ID ${id} no encontrado`);
    return provider;
  }

  // Actualizar proveedor
  async update(id: string, updateProviderDto: UpdateProviderDto): Promise<Provider> {
    const provider = await this.findOne(id);
    Object.assign(provider, updateProviderDto);
    return await this.providerRepository.save(provider);
  }

  // Eliminar proveedor
  async remove(id: string): Promise<void> {
    const provider = await this.findOne(id);
    await this.providerRepository.remove(provider);
  }
}
