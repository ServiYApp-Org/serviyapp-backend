import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as dotenvConfig } from 'dotenv';

// Carga el archivo .env (puedes cambiarlo si usas .development.env)
dotenvConfig({ path: '.development.env' });

const isDev = process.env.NODE_ENV !== 'production';

const config: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Solo para desarrollo
  dropSchema: isDev,
  synchronize: isDev,

  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  logging: isDev,
};

export default registerAs('typeorm', () => config);

// Para CLI (typeorm migration:run, etc.)
export const connectionSource = new DataSource(config);
