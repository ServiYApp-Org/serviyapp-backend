import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { ServiceOrder } from 'src/modules/service-orders/entities/service-order.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ default: 'active' })
  status: string;

  @Column({ nullable: true })
  profilePicture: string;

  @CreateDateColumn({ type: 'timestamp' })
  registrationDate: Date;

  @OneToMany(() => ServiceOrder, (order) => order.user)
  orders: ServiceOrder[];
}
