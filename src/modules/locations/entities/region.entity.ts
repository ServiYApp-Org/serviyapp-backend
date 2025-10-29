import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Country } from './country.entity';
import { City } from './city.entity';

@Entity({ name: 'regions' })
export class Region {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Country, (country) => country.regions)
  country: Country;

  @OneToMany(() => City, (city) => city.region)
  cities: City[];
}
