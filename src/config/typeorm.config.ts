import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Detectar entorno ANTES de cargar dotenv
const nodeEnv = process.env.NODE_ENV?.trim() || 'development';
const isProduction = nodeEnv === 'production';

// Determinar archivo a cargar
const envFilePath = isProduction ? '.production.env' : '.development.env';

// Forzar carga del archivo correcto (y sobrescribir lo previo)
dotenv.config({ path: envFilePath, override: true });

console.log(`Entorno actual: ${nodeEnv}`);
console.log(`Cargando archivo env: ${envFilePath}`);

const config: DataSourceOptions = isProduction
  ? {
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      synchronize: false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      logging: false,
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      ssl: false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      logging: true,
    };

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
