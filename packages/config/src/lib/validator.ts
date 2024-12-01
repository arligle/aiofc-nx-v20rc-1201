import { applyDecorators } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  ValidateNested,
  IsObject,
  ValidationOptions,
  IsOptional,
} from 'class-validator';

interface ValidateNestedPropertyOptions<T> {
  required?: boolean;
  validationOptions?: ValidationOptions;
  classType: new () => T;
}
/**
 * @description 配置类的Root属性必须用ValidateNested 和 Type这两个装饰器修饰校验和类型转换，
 * 否则会导致yaml配置文件的层级嵌套无法解析
 * @template T
 * @param {
 *   required = true,
 *   validationOptions = {},
 *   classType,
 * }
 * @return {*}
 * @example
 * export default class RootConfig {
      @ValidateNestedProperty({ classType: AppConfig })
      public readonly app!: AppConfig;
    }
 */
export const ValidateNestedProperty = <T>({
  required = true,
  validationOptions = {},
  classType,
}: ValidateNestedPropertyOptions<T>) => {
  /**
   * Type 是一个来自 class-transformer 库的装饰器，用于指定属性的类型。
   * 它接受一个返回类型构造函数的函数作为参数。
   * 在这段代码中，传递给 Type 装饰器的函数返回 classType，
   * 这意味着该属性的类型将被指定为 classType。
   * 这个装饰器通常用于在对象转换过程中，确保属性的类型能够被正确识别和处理。
   */
  const decorators = [ValidateNested(validationOptions), Type(() => classType)];

  if (required) {
    decorators.push(IsObject(validationOptions));
  } else {
    decorators.push(IsOptional(validationOptions));
  }

  return applyDecorators(...decorators);
};
