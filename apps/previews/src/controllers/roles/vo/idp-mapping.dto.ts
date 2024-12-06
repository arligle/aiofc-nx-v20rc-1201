import { IsStringCombinedLocalized } from '@aiofc/validation';

/**
 * IdP映射DTO类
 * 用于验证和转换身份提供商(IdP)返回的用户属性映射
 */
export class IdpMappingDto {
  /**
   * 用户名
   * @IsStringCombinedLocalized - 使用本地化的字符串验证
   * - minLength: 最小长度为1
   * - maxLength: 最大长度为512
   */
  @IsStringCombinedLocalized({
    minLength: 1,
    maxLength: 512,
  })
  firstName!: string;

  /**
   * 用户姓氏
   * @IsStringCombinedLocalized - 使用本地化的字符串验证
   * - minLength: 最小长度为1
   * - maxLength: 最大长度为512
   */
  @IsStringCombinedLocalized({
    minLength: 1,
    maxLength: 512,
  })
  lastName!: string;

  /**
   * 用户邮箱
   * @IsStringCombinedLocalized - 使用本地化的字符串验证
   * - minLength: 最小长度为1
   * - maxLength: 最大长度为512
   */
  @IsStringCombinedLocalized({
    minLength: 1,
    maxLength: 512,
  })
  email!: string;

  /**
   * 用户角色
   * @IsStringCombinedLocalized - 使用本地化的字符串验证
   * - minLength: 最小长度为1
   * - maxLength: 最大长度为512
   */
  @IsStringCombinedLocalized({
    minLength: 1,
    maxLength: 512,
  })
  role!: string;
}
