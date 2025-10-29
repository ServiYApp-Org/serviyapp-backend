import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Region } from './region.entity';

@Entity({ name: 'cities' })
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @ManyToOne(() => Region, (region) => region.cities)
  region: Region;
}
