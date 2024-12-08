import { IsUrlLocalized, IsUUIDLocalized } from '@aiofc/validation';
import { Expose } from 'class-transformer';

/**
 * SAML登录初始化请求DTO类
 * 用于发起SAML SSO登录流程时的请求参数验证
 */
export class InitiateSamlLoginRequest {
  /**
   * 登录成功后的重定向URL
   * @Expose() - 在序列化/反序列化时暴露此字段
   * @IsUrlLocalized() - 验证是否为合法URL,使用本地化的错误消息
   */
  @Expose()
  @IsUrlLocalized()
  redirectUrl!: string;

  /**
   * SAML配置的唯一标识符
   * @Expose() - 在序列化/反序列化时暴露此字段
   * @IsUUIDLocalized() - 验证是否为合法UUID,使用本地化的错误消息
   */
  @Expose()
  @IsUUIDLocalized()
  samlConfigurationId!: string;
}

/**
 * 生成SAML元数据请求DTO类
 * 用于生成SAML服务提供商(SP)元数据时的请求参数验证
 */
export class GenerateMetadataRequest {
  /**
   * SAML配置的唯一标识符
   * @IsUUIDLocalized() - 验证是否为合法UUID,使用本地化的错误消息
   */
  @IsUUIDLocalized()
  samlConfigurationId!: string;

  /**
   * 租户的唯一标识符
   * @IsUUIDLocalized() - 验证是否为合法UUID,使用本地化的错误消息
   */
  @IsUUIDLocalized()
  tenantId!: string;
}
