import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { ServiceOrder } from 'src/modules/service-orders/entities/service-order.entity';
import { Service } from 'src/modules/services/entities/service.entity';
import { Country } from 'src/modules/locations/entities/country.entity';
import { Region } from 'src/modules/locations/entities/region.entity';
import { City } from 'src/modules/locations/entities/city.entity';
import { Role } from 'src/modules/auth/roles.enum';

@Entity({ name: 'providers' })
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  names: string;

  @Column({ type: 'varchar', length: 50 })
  surnames: string;

  @Column({ type: 'varchar', length: 20, })
  userName: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'bigint', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar' })
  password: string;

  // Relaciones normalizadas
  @ManyToOne(() => Country, { eager: true, nullable: true })
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @ManyToOne(() => Region, { eager: true, nullable: true })
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @ManyToOne(() => City, { eager: true, nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'enum', enum: Role, default: Role.Provider })
  role: Role;

  @Column({ default: 'pending' })
  status: string;

  @CreateDateColumn({ type: 'timestamp' })
  registrationDate: Date;

  @OneToMany(() => Service, (service) => service.provider)
  services: Service[];

  @OneToMany(() => ServiceOrder, (order) => order.provider)
  orders: ServiceOrder[];
}
