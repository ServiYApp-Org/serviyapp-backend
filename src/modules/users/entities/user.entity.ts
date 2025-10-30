import { Length } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  Check,
} from 'typeorm';
import { ServiceOrder } from 'src/modules/service-orders/entities/service-order.entity';
import { Role } from 'src/modules/auth/roles.enum';

@Check(`"names" ~ '^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{2,50}$'`)
@Check(`"surnames" ~ '^[A-Za-zÁÉÍÓÚáéíóúÑñ\\s]{2,50}$'`)
@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  names: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  surnames: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @Column({ type: 'varchar', default: 'active' })
  status: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ type: 'varchar', nullable: true })
  profilePicture: string;

  @CreateDateColumn({ type: 'timestamp' })
  registrationDate: Date;

  @OneToMany(() => ServiceOrder, (order) => order.user)
  orders: ServiceOrder[];
}
