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

// BaseSignUpByEmailRequest 类继承自 UserProfile,但排除了一些字段
export class BaseSignUpByEmailRequest extends OmitType(UserProfile, [
  ...DEFAULT_CREATE_ENTITY_EXCLUDE_LIST,  // 排除默认的实体创建排除列表
  'id',        // 排除id字段
  'version',   // 排除版本字段
  'status',    // 排除状态字段
  'userTenantsAccounts', // 排除用户租户账号关联字段
] as const) {
  /**
   * @description 重复密码字段
   * 在前后端都进行验证是个好习惯,即使前端验证出现问题也能避免垃圾数据进入数据库
   * */
  @PasswordLocalized()  // 使用本地化的密码验证装饰器
  @MatchesWithProperty(
    BaseSignUpByEmailRequest,
    (s) => s.password,
    {
    message: 'validation.REPEAT_PASSWORD_DOESNT_MATCH', // 当重复密码不匹配时的错误消息
  })
  @IsStringCombinedLocalized() // 使用本地化的字符串组合验证装饰器
  repeatedPassword!: string;  // 重复密码字段,使用!表示该字段是必需的
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
