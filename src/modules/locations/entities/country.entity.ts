import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Region } from './region.entity';

@Entity({ name: 'countries' })
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 5, unique: true })
  code: string; // Ej: CO, AR, MX

  @OneToMany(() => Region, (region) => region.country)
  regions: Region[];
}
