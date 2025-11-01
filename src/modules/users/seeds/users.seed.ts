import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Address } from '../../addresses/entities/address.entity';
import { Country } from '../../locations/entities/country.entity';
import { Region } from '../../locations/entities/region.entity';
import { City } from '../../locations/entities/city.entity';
import { Role } from '../../auth/roles.enum';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../enums/user-status.enum';



// Servicio de precarga (seed) para usuarios.
// Crea usuarios iniciales, direcciones y un administrador por defecto.
@Injectable()
export class UsersSeed {
  private readonly logger = new Logger(UsersSeed.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,

    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>,

    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,

    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
  ) {}

  async onModuleInit() {
    if (process.env.NODE_ENV === 'production') return;

    const existingUsers = await this.userRepo.count();
    if (existingUsers > 0) {
      this.logger.warn('Usuarios ya existen, se omite creación inicial.');
      return;
    }

    // Cargar archivo JSON con los usuarios iniciales.
    const filePath = path.join('src/modules/users/seeds/data/users.json');
    if (!fs.existsSync(filePath)) {
      this.logger.error(`[UsersSeed] No se encontró el archivo users.json en: ${filePath}`);
      return;
    }

    const rawData = fs.readFileSync(filePath, 'utf8');
    const usersData = JSON.parse(rawData);
    this.logger.log(`[UsersSeed] ${usersData.length} usuarios encontrados en el JSON.`);

    // Obtener ubicaciones registradas.
    const countries = await this.countryRepo.find({ relations: ['regions'] });
    if (!countries.length) {
      this.logger.error('No hay países registrados.');
      return;
    }

    for (const u of usersData) {
      // Selección aleatoria de país, región y ciudad.
      const randomCountry = countries[Math.floor(Math.random() * countries.length)];
      const regions = await this.regionRepo.find({
        where: { country: { id: randomCountry.id } },
        relations: ['cities'],
      });
      const randomRegion = regions[Math.floor(Math.random() * regions.length)];
      const cities = await this.cityRepo.find({ where: { region: { id: randomRegion.id } } });
      const randomCity = cities[Math.floor(Math.random() * cities.length)];

      const normalizedRole = (u.role || '').toLowerCase();
      const userRole =
        Object.values(Role).includes(normalizedRole as Role)
          ? (normalizedRole as Role)
          : Role.User;


      // Crear usuario.
      const user = this.userRepo.create({
        names: u.names,
        surnames: u.surnames,
        email: u.email,
        password: await bcrypt.hash(u.password, 10),
        phone: String(u.phone),
        role: userRole,              
        status: UserStatus.ACTIVE,    
        isCompleted: true,
        registrationDate: new Date(),
      });


      // Crear dirección asociada.
      const address = this.addressRepo.create({
        name: 'Casa',
        address: u.address || 'Dirección desconocida',
        neighborhood: 'Centro',
        buildingType: 'Apartamento',
        comments: 'Dirección creada automáticamente',
        status: true,
        country: randomCountry,
        region: randomRegion,
        city: randomCity,
        user: await this.userRepo.save(user),
      });

      await this.addressRepo.save(address);

      this.logger.log(`Usuario creado: ${u.names} ${u.surnames}`);
    }

    // Crear usuario administrador por defecto.
    await this.ensureAdminExists();

    this.logger.log('Usuarios y direcciones creados correctamente.');
  }

  // Crea el usuario administrador si no existe.
  private async ensureAdminExists() {
    const adminEmail = 'admin@serviyapp.com';
    const existingAdmin = await this.userRepo.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      this.logger.log('Admin ya existe, no se recrea.');
      return;
    }

    const countries = await this.countryRepo.find({ relations: ['regions'] });
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const regions = await this.regionRepo.find({
      where: { country: { id: randomCountry.id } },
      relations: ['cities'],
    });
    const randomRegion = regions[Math.floor(Math.random() * regions.length)];
    const cities = await this.cityRepo.find({ where: { region: { id: randomRegion.id } } });
    const randomCity = cities[Math.floor(Math.random() * cities.length)];

    const admin = this.userRepo.create({
      names: 'Administrador',
      surnames: 'ServiyApp',
      email: adminEmail,
      password: await bcrypt.hash('admin123', 10),
      phone: '+573001112233',
      role: Role.Admin,
      status: UserStatus.ACTIVE,
      isCompleted: true,
      registrationDate: new Date(),
    });

    const savedAdmin = await this.userRepo.save(admin);

    const address = this.addressRepo.create({
      name: 'Oficina Principal',
      address: 'Carrera 10 #100-50',
      neighborhood: 'Centro',
      buildingType: 'Oficina',
      comments: 'Dirección del administrador',
      status: true,
      country: randomCountry,
      region: randomRegion,
      city: randomCity,
      user: savedAdmin,
    });

    await this.addressRepo.save(address);
    this.logger.log('Usuario administrador creado correctamente.');
  }
}
