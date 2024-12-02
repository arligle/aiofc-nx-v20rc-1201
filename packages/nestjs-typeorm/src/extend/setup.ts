import { DataSource, DataSourceOptions } from 'typeorm';
import { getDataSourceByName } from 'typeorm-transactional/dist/common';
import { addTransactionalDataSource } from 'typeorm-transactional';
import {
  DEFAULT_SETUP_TYPEORM_OPTIONS,
  SetupTypeormOptions,
} from './vo/setup-typeorm-options';
import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '../core';
/**
 * @description 主要作用是简化 TypeORM 模块的配置和初始化过程，返回一个数据源。
 * 这个函数应当只在应用启动时调用，因为它只执行一次，具有全局性地配置和管理数据库连接。
 */
function forRootAsync(options?: SetupTypeormOptions): Promise<DynamicModule> {
  const optionsWithDefault = {
    ...DEFAULT_SETUP_TYPEORM_OPTIONS,
    ...options,
  };
  /* TypeOrmModule.forRootAsync() 是一个异步初始化函数，我们在这里做了两件事情：
  1. 指定了自定义的 TypeOrmConfigService，并实现TypeOrmModule模块的注册。
  2. 通过 dataSourceFactory 方法异步初始化数据源和数据库连接。

  注意：我们并没有在这里注册实体，和提供操作实体的方法。因为这个需求不具有全局性，
  应在更加恰当的地方，由TypeOrmModule.forFeature(Object.values(Entities)) 来完成。*/
  return Promise.resolve(TypeOrmModule.forRootAsync({
    // 通过useClass方式来配置，指定了由自定义的TypeOrmConfigService类来完成：
    // packages/typeorm/src/lib/config/typeorm-config.service.ts
    useClass: optionsWithDefault.optionsFactory, // 指向
    /* 使用 optionsFactory 创建 TypeORM 配置服务，
    并通过 dataSourceFactory 方法异步初始化数据源。
    如果数据源已经存在，则返回现有的数据源；否则，创建一个新的数据源并初始化它。*/
    dataSourceFactory: async (baseOptions?: DataSourceOptions) => {
      /* istanbul ignore next */
      if (!baseOptions) {
        throw new Error(`Can not initialize data source, options are empty`);
      }

      const existDatasource = getDataSourceByName('default');
      // 如果数据源已经存在，则返回现有的数据源
      if (existDatasource) {
        return existDatasource;
      }

      const options = {
        ...baseOptions,
        migrations: optionsWithDefault.migrations,
      };
      // 创建一个新的数据源并初始化它
      const dataSource = new DataSource(options);
      addTransactionalDataSource(dataSource);

    /* 这是这个函数真正要做的事情：
    执行与数据库的连接。
    应在应用程序引导时调用此方法一次。
    此方法不一定创建数据库连接（取决于数据库类型），
    但它也可以设置一个与数据库的连接池来使用。*/
      return await dataSource.initialize();
    },
  }));
}
/**
 * @description 用于配置 TypeORM 模块的初始化过程，创建一个数据库的连接池，建议全局使用。
 * @export
 * @param [options]
 * @return {*}
 */
export function typeOrmModuleConfig(options?: SetupTypeormOptions): Promise<DynamicModule> {
  return forRootAsync(options);
}
