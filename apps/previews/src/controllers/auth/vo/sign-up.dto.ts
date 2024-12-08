import {
  IsStringCombinedLocalized,
  MatchesWithProperty,
  PasswordLocalized,
} from '@aiofc/validation';
import { OmitType } from '@nestjs/swagger';
import { UserProfile } from '../../../database/entities';
import { JwtTokensPayload } from '@aiofc/auth';
import { DEFAULT_CREATE_ENTITY_EXCLUDE_LIST } from '@aiofc/typeorm';
import { Expose } from 'class-transformer';

/**
 * 基础通过邮件注册请求信息类
 *
 * 功能说明:
 * - 继承自 UserProfile 类,但排除了一些不需要的字段
 * - 用于处理基础的邮箱注册请求
 * - 添加了重复密码验证功能
 *
 * 继承说明:
 * 使用 OmitType 从 UserProfile 中排除以下字段:
 * - DEFAULT_CREATE_ENTITY_EXCLUDE_LIST: 默认的实体创建排除字段列表
 * - id: 数据库主键字段
 * - version: 版本控制字段
 * - status: 状态字段
 * - userTenantsAccounts: 用户-租户关联字段
 */
export class BaseSignUpByEmailRequest extends OmitType(UserProfile, [
  ...DEFAULT_CREATE_ENTITY_EXCLUDE_LIST,
  'id',
  'version',
  'status',
  'userTenantsAccounts',
] as const) {
  /**
   * repeatedPassword 字段
   *
   * 功能说明:
   * - 用于验证用户两次输入的密码是否一致
   * - 在前后端都进行验证,确保数据的正确性
   *
   * 装饰器说明:
   * @PasswordLocalized - 使用本地化的密码格式验证
   * @MatchesWithProperty - 验证与password字段是否匹配
   * @IsStringCombinedLocalized - 使用本地化的字符串验证
   *
   * 字段说明:
   * - 类型为string
   * - 使用!表示该字段为必填项
   * - 当两次密码不匹配时返回validation.REPEAT_PASSWORD_DOESNT_MATCH错误
   */
  @PasswordLocalized()
  @MatchesWithProperty(
    BaseSignUpByEmailRequest,
    (s) => s.password,
    {
      message: 'validation.REPEAT_PASSWORD_DOESNT_MATCH',
    }
  )
  @IsStringCombinedLocalized()
  repeatedPassword!: string;
}

/**
 * 带租户创建的邮箱注册请求类
 * 继承自BaseSignUpByEmailRequest基础注册类,添加了公司相关信息
 */
export class SignUpByEmailWithTenantCreationRequest extends BaseSignUpByEmailRequest {
  /**
   * 公司名称
   * 使用IsStringCombinedLocalized装饰器进行验证
   * 长度限制在1-127个字符之间
   */
  @IsStringCombinedLocalized({
    minLength: 1,
    maxLength: 127,
  })
  companyName!: string;

  /**
   * 公司标识符
   * 使用IsStringCombinedLocalized装饰器进行验证
   * 长度限制在1-127个字符之间
   */
  @IsStringCombinedLocalized({
    minLength: 1,
    maxLength: 127,
  })
  companyIdentifier!: string;
}

/**
 * 普通邮箱注册请求类
 * 继承自BaseSignUpByEmailRequest基础注册类
 * 不包含租户(公司)相关信息,仅包含基本用户信息和密码
 */
export class SignUpByEmailRequest extends BaseSignUpByEmailRequest {}
/**
 * 邮箱注册响应类
 * 包含审批ID和JWT令牌信息
 */
export class SignUpByEmailResponse {
  /**
   * 审批实体ID,用于后续复用
   * */
  @Expose()
  approvalId!: string;

  /**
   * JWT令牌载荷,在不需要验证就让用户登录的场景下很有用
   * */
  @Expose()
  jwtPayload!: JwtTokensPayload;
}
/**
 * 邮箱注册响应DTO类
 * 继承自SignUpByEmailResponse,但排除了jwtPayload字段
 * 使用OmitType工具类来实现字段排除
 * 添加了message消息字段用于返回响应提示
 */
export class SignUpByEmailResponseDTO extends OmitType(SignUpByEmailResponse, [
  'jwtPayload',
] as const) {
  /**
   * 响应消息
   * */
  @Expose()
  message!: string;
}
