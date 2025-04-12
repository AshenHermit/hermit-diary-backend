import { DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST ?? 'db',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  username: 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: 'postgres',
  entities: [process.env.DB_ENTITIES ?? 'dist/**/*.entity.{ts,js}'],
  synchronize: process.env.DB_SYNC == '1',
};
