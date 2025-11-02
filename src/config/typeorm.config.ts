import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Detectar entorno
const nodeEnv = process.env.NODE_ENV?.trim() || 'development';
const isProduction = nodeEnv === 'production';
const isTest = nodeEnv === 'test';
const isDevelopment = nodeEnv === 'development';

// Cargar el archivo .env correcto
const envFilePath = isProduction
  ? '.production.env'
  : isTest
  ? '.test.env'
  : '.development.env';

dotenv.config({ path: envFilePath, override: true });

console.log(`Entorno actual: ${nodeEnv}`);
console.log(`Cargando archivo env: ${envFilePath}`);

// Leer variable SEED_ON_START (por defecto false)
const seedOnStart =
  process.env.SEED_ON_START?.toLowerCase() === 'true' ? true : false;

// Configuración dinámica de TypeORM
const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  synchronize: !isProduction, // solo auto-sync en dev y test
  dropSchema: seedOnStart, // usa variable SEED_ON_START para limpiar BD
  logging: !isTest && !isProduction, // silencia logs en test/prod
};

if (seedOnStart) {
  console.warn(
    'SEED_ON_START=true → Se eliminará el esquema y se recargará la base de datos al iniciar.',
  );
}

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config);
