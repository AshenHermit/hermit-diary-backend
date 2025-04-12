import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';
import { dataSourceOptions } from './typeorm.config';

export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  public createTypeOrmOptions(
    connectionName?: string,
  ): Promise<TypeOrmModuleOptions> | TypeOrmModuleOptions {
    return dataSourceOptions;
  }
}
