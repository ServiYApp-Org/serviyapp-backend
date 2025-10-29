import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Provider } from 'src/modules/providers/entities/provider.entity';
import { Category } from 'src/modules/categories/entities/category.entity';

@Entity({ name: 'services' })
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: true })
  status: boolean;

  @Column({ type: 'int', nullable: true })
  duration: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Provider, (provider) => provider.services, {
    onDelete: 'CASCADE',
  })
  provider: Provider;

  @ManyToOne(() => Category, (category) => category.services)
  category: Category;
}
