import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  Check,
} from 'typeorm';
import { ServiceOrder } from 'src/modules/service-orders/entities/service-order.entity';
import { Service } from 'src/modules/services/entities/service.entity';
import { Country } from 'src/modules/locations/entities/country.entity';
import { Region } from 'src/modules/locations/entities/region.entity';
import { City } from 'src/modules/locations/entities/city.entity';
import { Role } from 'src/modules/auth/roles.enum';

// Entidad que representa a los proveedores registrados en el sistema.
// Incluye datos personales, de ubicación, estado y relaciones con servicios y órdenes.
@Check(`"names" ~ '^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{2,50}$'`)
@Check(`"surnames" ~ '^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{2,50}$'`)
@Entity({ name: 'providers' })
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  names: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  surnames: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  userName: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  // Relaciones con entidades de ubicación
  @ManyToOne(() => Country, { eager: true, nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => Region, { eager: true, nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @ManyToOne(() => City, { eager: true, nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ type: 'varchar', length: 150, nullable: true })
  address: string;

  @Column({ type: 'varchar', nullable: true })
  profilePicture?: string;

  @Column({ type: 'enum', enum: Role, default: Role.Provider })
  role: Role;

  @Column({ default: 'pending' })
  status: string;

  @Column({ default: false })
  isCompleted: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  registrationDate: Date;

  @OneToMany(() => Service, (service) => service.provider)
  services: Service[];

  @OneToMany(() => ServiceOrder, (order) => order.provider)
  orders: ServiceOrder[];
}
