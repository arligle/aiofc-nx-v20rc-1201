import {
  ExternalApproval,
  UserProfile,
  UserRole,
} from '../../database/entities';
import { Maybe } from '@aiofc/common-types';
import { BaseSignUpByEmailRequest } from '../../controllers/auth/vo/sign-up.dto';
import { JwtTokensPayload } from '@aiofc/auth';

/**
 * 抽象用户认证服务类
 * 定义了用户认证相关的核心方法
 */
export default abstract class AbstractAuthUserService {
  /*
    {
      provide: AbstractAuthUserService, // 令牌服务
      useClass: AuthUserService, // 令牌服务实现
    },
  */

  /**
   * 通过邮箱查找用户
   * @param email 用户邮箱
   * @returns 返回用户信息,如果不存在则返回null
   */
  public abstract findUserByEmail(email: string): Promise<Maybe<UserProfile>>;

  /**
   * 通过邮箱创建新用户
   * @param signUpByEmailRequest 邮箱注册请求参数
   * @returns 返回创建的用户信息和外部审批信息
   */
  public abstract createUserByEmail(
    signUpByEmailRequest: BaseSignUpByEmailRequest,
  ): Promise<{
    user: UserProfile;
    externalApproval: ExternalApproval;
  }>;

  // /**
  //  * 通过SSO创建用户
  //  * @param tenantId 租户ID
  //  * @param email 用户邮箱
  //  * @param firstName 名
  //  * @param lastName 姓
  //  * @param roles 用户角色列表
  //  * @param userProfileId 可选的用户档案ID
  //  * @returns 返回JWT令牌信息
  //  */
  // public abstract createSsoUser(
  //   tenantId: string,
  //   email: string,
  //   firstName: string,
  //   lastName: string,
  //   roles: UserRole[],
  //   userProfileId?: string,
  // ): Promise<JwtTokensPayload>;

  // /**
  //  * 保存刷新令牌
  //  * @param userId 用户ID
  //  * @param token 刷新令牌
  //  */
  // public abstract saveRefreshToken(
  //   userId: string,
  //   token: string,
  // ): Promise<void>;

  // /**
  //  * 审批用户注册
  //  * @param approveId 审批ID
  //  * @param code 审批码
  //  * @returns 返回审批是否成功
  //  */
  // public abstract approveSignUp(
  //   approveId: string,
  //   code: string,
  // ): Promise<boolean>;
}
