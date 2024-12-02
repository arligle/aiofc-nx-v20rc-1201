import { Injectable } from '@nestjs/common';
import { DbConfig } from './db';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '../core';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly dbConfig: DbConfig) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      ...this.dbConfig,
    } as TypeOrmModuleOptions;
  }
}
