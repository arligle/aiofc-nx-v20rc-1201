import {
  ArgumentMetadata,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { I18nContext } from '../i18n.context';
import { i18nValidationErrorFactory } from '../utils';

export type I18nValidationPipeOptions = Omit<
  ValidationPipeOptions,
  'exceptionFactory'
>;
/**
 * @description 具有国际化逻辑的验证管道，它继承自@nestjs/common中的ValidationPipe。
 * ValidationPipe 提供了一种便捷的方法来对所有传入的客户端有效负载执行验证规则，
 * 其中特定规则在每个模块的本地类/DTO 声明中使用简单的注释进行声明。
 * @export
 * @class I18nValidationPipe
 */
export class I18nValidationPipe extends ValidationPipe {
  constructor(options?: I18nValidationPipeOptions) {
    super({
      ...options,
      exceptionFactory: i18nValidationErrorFactory,
    });
  }

  protected override toValidate(metadata: ArgumentMetadata): boolean {
    const { metatype } = metadata;
    return metatype !== I18nContext && super.toValidate(metadata);
  }
}
