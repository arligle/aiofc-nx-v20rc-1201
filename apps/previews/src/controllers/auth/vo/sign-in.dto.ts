import { PickType } from '@nestjs/swagger';
import { UserProfile } from '../../../database/entities';
import { Expose } from 'class-transformer';

/**
 * 登录请求DTO类
 * 通过 @nestjs/swagger 的 PickType 工具类从 UserProfile 实体中选取部分字段
 *
 * 继承了 UserProfile 实体的以下字段:
 * - email: 用户邮箱
 * - password: 用户密码
 */
export class SignInRequest extends PickType(UserProfile, [
  'email',
  'password',
]) {}

/**
 * 登录响应基础类
 * 包含登录成功后返回的令牌信息
 */
export class SignInResponse {
  /**
   * 访问令牌
   * @Expose() - 在序列化/反序列化时暴露此字段
   */
  @Expose()
  accessToken!: string;

  /**
   * 刷新令牌
   * @Expose() - 在序列化/反序列化时暴露此字段
   */
  @Expose()
  refreshToken!: string;
}

/**
 * 登录响应DTO类
 * 继承自SignInResponse,添加了额外的消息字段
 */
export class SignInResponseDTO extends SignInResponse {
  /**
   * 登录响应消息
   * @Expose() - 在序列化/反序列化时暴露此字段
   */
  @Expose()
  message!: string;
}
