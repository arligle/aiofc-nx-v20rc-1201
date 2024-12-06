import {
  IsBooleanLocalized,
  IsStringCombinedLocalized,
  IsUrlLocalized,
} from '@aiofc/validation';
import { Expose, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { IdpMappingDto } from '../../roles/vo/idp-mapping.dto';
import { SAMLConfiguration } from '../../../database/entities';
import { PickType } from '@nestjs/swagger';

/**
 * SAML配置设置类
 * 用于验证和转换SAML配置的相关参数
 */
export class SetupSamlConfiguration {
  /**
   * SAML身份提供商(IdP)的入口点URL
   * @IsUrlLocalized - 使用本地化的URL格式验证装饰器
   * @Expose - 在序列化/反序列化时暴露此字段
   */
  @IsUrlLocalized()
  @Expose()
  entryPoint!: string;

  /**
   * SAML身份提供商(IdP)的证书字符串
   * @IsStringCombinedLocalized - 使用本地化的字符串验证装饰器
   * @Expose - 在序列化/反序列化时暴露此字段
   */
  @IsStringCombinedLocalized()
  @Expose()
  certificate!: string;

  /**
   * IdP返回的用户属性映射配置
   * @Type - 指定类型为IdpMappingDto,用于类型转换
   * @ValidateNested - 验证嵌套的IdpMappingDto对象
   * @Expose - 在序列化/反序列化时暴露此字段
   */
  @Type(/* istanbul ignore next */ () => IdpMappingDto)
  @ValidateNested()
  @Expose()
  fieldsMapping!: IdpMappingDto;

  /**
   * 是否启用SAML认证
   * @IsBooleanLocalized - 使用本地化的布尔值验证装饰器
   * @Expose - 在序列化/反序列化时暴露此字段
   */
  @IsBooleanLocalized()
  @Expose()
  enabled!: boolean;
}


/**
 * SAML配置响应DTO类
 * 通过PickType从SAMLConfiguration实体中选取id字段
 * 用于返回SAML配置设置的响应结果
 */
export class SetupSamlConfigurationResponseDTO extends PickType(
  SAMLConfiguration,
  ['id'],
) {
  /**
   * 响应消息
   * @Expose - 在序列化/反序列化时暴露此字段
   */
  @Expose()
  message!: string;
}
