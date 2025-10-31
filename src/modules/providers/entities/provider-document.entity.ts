import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Provider } from './provider.entity';

// Entidad que representa los documentos asociados a un proveedor.
// Incluye datos de identificación, soporte bancario y verificación.
@Entity({ name: 'provider_documents' })
export class ProviderDocument {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Provider, (provider) => provider.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'provider_id' })
  provider: Provider;

  @Column({ type: 'varchar', length: 50 })
  documentType: string; // Ejemplo: "ID", "RUT", "Certificado Bancario"

  @Column({ type: 'varchar', length: 50 })
  documentNumber: string;

  @Column({ type: 'varchar', nullable: true })
  file: string; // URL del documento

  @CreateDateColumn({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: string; // pending | approved | rejected

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  photoVerification: string;

  // Datos bancarios opcionales
  @Column({ type: 'varchar', length: 30, nullable: true })
  accountType: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  accountNumber: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  bank: string;

  @Column({ type: 'varchar', nullable: true })
  accountFile: string; // URL del soporte bancario
}
