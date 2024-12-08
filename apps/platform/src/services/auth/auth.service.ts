import { Injectable } from "@nestjs/common";
import { Transactional } from 'typeorm-transactional';
import AbstractAuthUserService from "./abstract-auth-user.service";
import { verifyPassword } from "@aiofc/utils";
import { UserProfileStatus } from "../../database/entities/users/types/user-profile-status.enum";
import { GeneralUnauthorizedException } from "@aiofc/exceptions";
import { UserProfile } from "../../database/entities";
import { AccessTokenPayload, RefreshTokenPayload } from "../../common/vo/token-payload";
import { AbstractTokenBuilderService, TokenService } from "@aiofc/auth";

@Injectable()
export class AuthService {
  constructor(
    private readonly authUserService: AbstractAuthUserService,
    // private readonly tokenBuilderService: AbstractTokenBuilderService<
    //   UserProfile,
    //   AccessTokenPayload,
    //   RefreshTokenPayload
    // >,
    //  private readonly tokenService: TokenService,

  ) { }

  /**
   * 用户登录方法
   *
   * @description
   * 该方法实现了用户登录的主要逻辑:
   * 1. 通过邮箱查找用户
   * 2. 验证用户状态和密码
   * 3. 生成并返回JWT令牌
   *
   * @param email - 用户邮箱
   * @param password - 用户密码
   * @returns 返回包含访问令牌和刷新令牌的对象
   * @throws GeneralUnauthorizedException - 当用户不存在、密码错误或账号未激活时抛出
   */
  @Transactional()
  async signIn(email: string, password: string) {
    console.log('已经进入到auth.service.ts');
    // 通过邮箱查找用户
    const user = await this.authUserService.findUserByEmail(email);
    console.log(user);

    // 验证用户是否存在、密码是否正确、账号是否激活
    if (
      !user ||
      user.password === undefined ||
      !(await verifyPassword(password, user.password)) ||
      user.status !== UserProfileStatus.ACTIVE
    ) {
      throw new GeneralUnauthorizedException();
    }
    throw new Error('Method not implemented.');
    // // 构建令牌载荷
    // const payload = this.tokenBuilderService.buildTokensPayload(user);
    // // 签发访问令牌和刷新令牌
    // return this.tokenService.signTokens(payload);
  }

  @Transactional()
  approveUserEmail(id: string, code: string) {
    throw new Error('Method not implemented.');
  }

  refreshAccessToken(email: string) {
    throw new Error('Method not implemented.');
  }
}