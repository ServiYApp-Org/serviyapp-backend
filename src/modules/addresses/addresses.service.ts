import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { Country } from 'src/modules/locations/entities/country.entity';
import { Region } from 'src/modules/locations/entities/region.entity';
import { City } from 'src/modules/locations/entities/city.entity';
import { User } from 'src/modules/users/entities/user.entity';

// Servicio encargado de las operaciones CRUD del módulo "addresses".
@Injectable()
export class AddressesService {
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

  // Crea una nueva dirección asociada a un usuario y sus ubicaciones.
  async create(dto: CreateAddressDto) {
    const country = await this.countryRepo.findOneBy({ id: dto.countryId });
    const region = await this.regionRepo.findOneBy({ id: dto.regionId });
    const city = await this.cityRepo.findOneBy({ id: dto.cityId });
    const user = await this.userRepo.findOneBy({ id: dto.userId });

    if (!country) throw new NotFoundException('Country not found');
    if (!region) throw new NotFoundException('Region not found');
    if (!city) throw new NotFoundException('City not found');
    if (!user) throw new NotFoundException('User not found');

    const newAddress = this.addressRepo.create({
      ...dto,
      country: { id: dto.countryId },
      region: { id: dto.regionId },
      city: { id: dto.cityId },
      user: { id: dto.userId },
    });

    return this.addressRepo.save(newAddress);
  }

  // Obtiene todas las direcciones con sus relaciones.
  async findAll() {
    return this.addressRepo.find({
      relations: ['country', 'region', 'city', 'user'],
      order: { name: 'ASC' },
    });
  }

  // Obtiene una dirección por su ID.
  async findOne(id: string) {
    const address = await this.addressRepo.findOne({
      where: { id },
      relations: ['country', 'region', 'city', 'user'],
    });

    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  // Actualiza una dirección existente.
  async update(id: string, dto: UpdateAddressDto) {
    const address = await this.findOne(id);
    Object.assign(address, dto);
    return this.addressRepo.save(address);
  }

  // Elimina una dirección de la base de datos.
  async remove(id: string) {
    const address = await this.findOne(id);
    await this.addressRepo.remove(address);
    return { message: `Address with ID ${id} was deleted successfully.` };
  }
}
