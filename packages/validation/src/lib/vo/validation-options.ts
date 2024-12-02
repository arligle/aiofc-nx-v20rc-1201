import { HttpStatus, ValidationPipeOptions } from '@nestjs/common';
/**
 * 全局的默认验证选项设定值
 * @type {*}
 */
const DEFAULT_VALIDATION_OPTIONS: ValidationPipeOptions = {
  transform: true,
  whitelist: true, // 只接受白名单中的属性, 其他属性将被过滤掉,所谓的白名单就是类的属性，实际上就是将DTO与类比较，并把对应不上的字段去除掉
  errorHttpStatusCode: HttpStatus.BAD_REQUEST,
};

export { DEFAULT_VALIDATION_OPTIONS };
