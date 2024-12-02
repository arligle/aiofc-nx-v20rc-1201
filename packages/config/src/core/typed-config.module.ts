import { Module, DynamicModule, Provider } from '@nestjs/common';
import { red, yellow, cyan, blue } from 'chalk';
import type { ClassConstructor } from 'class-transformer';
import type { ValidatorOptions, ValidationError } from 'class-validator';
import merge from 'lodash.merge';
import {
  TypedConfigModuleAsyncOptions,
  TypedConfigModuleOptions,
} from './interfaces/typed-config-module-options.interface';
import { forEachDeep } from './utils/for-each-deep.util';
import { identity } from './utils/identity.util';
import { debug } from './utils/debug.util';
import { validateSync, plainToClass } from './utils/imports.util';

@Module({})
export class TypedConfigModule {
  public static forRoot(options: TypedConfigModuleOptions): DynamicModule {
    const rawConfig = this.getRawConfig(options.load);

    return this.getDynamicModule(options, rawConfig);
  }

  public static async forRootAsync(
    options: TypedConfigModuleAsyncOptions,
  ): Promise<DynamicModule> {
    const rawConfig = await this.getRawConfigAsync(options.load);

    return this.getDynamicModule(options, rawConfig);
  }

  private static getDynamicModule(
    options: TypedConfigModuleOptions | TypedConfigModuleAsyncOptions,
    rawConfig: Record<string, any>, // 配置数据，键是字符串类型，值可以是任意类型
  ) {
    const {
      schema: Config,
      normalize = identity,
      validationOptions,
      isGlobal = true,
      validate = this.validateWithClassValidator.bind(this),
    } = options;
    // 传入的配置数据应当是一个对象
    if (typeof rawConfig !== 'object') {
      console.log('配置应该是一个对象，接收到：${rawConfig}。请检查“load()”的返回值')
      throw new Error(
        `Configuration should be an object, received: ${rawConfig}. Please check the return value of \`load()\``,
      );
    }
    const normalized = normalize(rawConfig);
    const config = validate(normalized, Config, validationOptions);
    const providers = this.getProviders(config, Config);

    return {
      global: isGlobal,
      module: TypedConfigModule,
      providers,
      exports: providers,
    };
  }
  // 从配置加载器中获取原始配置数据
  private static getRawConfig(load: TypedConfigModuleOptions['load']) {
    if (Array.isArray(load)) {
      const config = {};
      for (const fn of load) {
        // we shouldn't silently catch errors here, because app shouldn't start without the proper config
        // same way as it doesn't start without the proper database connection
        // and the same way as it now fail for the single loader
        try {
          const conf = fn(config);
          merge(config, conf);
        } catch (e: any) {
          debug(
            `Config load failed: ${e}. Details: ${JSON.stringify(e.details)}`,
          );
          throw e;
        }
      }
      return config;
    }
    return load();
  }

  private static async getRawConfigAsync(
    load: TypedConfigModuleAsyncOptions['load'],
  ) {
    if (Array.isArray(load)) {
      const config = {};
      for (const fn of load) {
        try {
          const conf = await fn(config);
          merge(config, conf);
        } catch (e: any) {
          debug(
            `Config load failed: ${e}. Details: ${JSON.stringify(e.details)}`,
          );
          throw e;
        }
      }
      return config;
    }
    return load();
  }

  private static getProviders(
    config: any,
    Config: ClassConstructor<any>,
  ): Provider[] {
    const providers: Provider[] = [
      {
        provide: Config,
        useValue: config,
      },
    ];
    forEachDeep(config, value => {
      if (
        value &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        value.constructor !== Object
      ) {
        providers.push({ provide: value.constructor, useValue: value });
      }
    });

    return providers;
  }

  private static validateWithClassValidator(
    rawConfig: any,
    Config: ClassConstructor<any>,
    options?: Partial<ValidatorOptions>,
  ) {
    const config = plainToClass(Config, rawConfig, {
      exposeDefaultValues: true,
    });
    // defaults to strictest validation rules
    const schemaErrors = validateSync(config, {
      forbidUnknownValues: true,
      whitelist: true,
      ...options,
    });
    if (schemaErrors.length > 0) {
      const configErrorMessage = this.getConfigErrorMessage(schemaErrors);
      // TODO:
      console.log('配置参数验证未能通过！');
      console.log(config)
      throw new Error(configErrorMessage);
    }
    // TODO: 生产环境应当删除这段代码
    console.log(`\n解析配置文件的信息，生产环境应当删除这段代码:\n`);
    console.log(config);
    console.log(`\n`);
    return config;
  }
  // 格式化错误信息
  static getConfigErrorMessage(errors: ValidationError[]): string {
    const messages = this.formatValidationError(errors)
      .map(({ property, value, constraints }) => {
        const constraintMessage = Object.entries(
          constraints || /* istanbul ignore next */ {},
        )
          .map(
            ([key, val]) =>
              `    - ${key}: ${yellow(val)}, current config is \`${blue(
                JSON.stringify(value),
              )}\``,
          )
          .join(`\n`);
        const msg = [
          `  - config ${cyan(property)} does not match the following rules:`,
          `${constraintMessage}`,
        ].join(`\n`);
        return msg;
      })
      .filter(Boolean)
      .join(`\n`);
    const configErrorMessage = red(
      `Configuration is not valid:\n${messages}\n`,
    );
    return configErrorMessage;
  }

  /**
   * 将类验证器返回的验证错误对象转换为 more
   * 可读的错误消息。
   */
  private static formatValidationError(errors: ValidationError[]) {
    const result: {
      property: string;
      constraints: ValidationError['constraints'];
      value: ValidationError['value'];
    }[] = [];
    const helper = (
      { property, constraints, children, value }: ValidationError,
      prefix: string,
    ) => {
      const keyPath = prefix ? `${prefix}.${property}` : property;
      if (constraints) {
        result.push({
          property: keyPath,
          constraints,
          value,
        });
      }
      if (children && children.length) {
        children.forEach(child => helper(child, keyPath));
      }
    };
    errors.forEach(error => helper(error, ``));
    return result;
  }
}
