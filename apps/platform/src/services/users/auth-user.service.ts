import { Injectable, Logger } from '@nestjs/common';
import AbstractAuthUserService from '../auth/abstract-auth-user.service';
import { JwtTokensPayload } from '@aiofc/auth';
import { Maybe } from '@aiofc/common-types';
import { BaseSignUpByEmailRequest } from '../../controllers/auth/vo/sign-up.dto';
import { UserProfile, ExternalApproval, UserRole } from '../../database/entities';
import { Transactional } from 'typeorm-transactional';
import { UserProfileStatus } from '../../database/entities/users/types/user-profile-status.enum';
import { generateRandomNumber } from '@aiofc/utils';
import { ApprovalType } from '../../database/entities/users/types/approval-type.enum';


@Injectable()
export default class AuthUserService extends AbstractAuthUserService {

    /**
   * 通过邮箱查找用户
   *
   * @description
   * 这是一个事务性方法,用于根据邮箱地址查找用户信息
   *
   * @param email - 用户邮箱地址
   * @returns 如果找到用户则返回UserProfile对象,否则返回undefined
   *
   * 实现逻辑:
   * 1. 调用userService.findOneByEmail方法查询用户
   * 2. 如果未找到用户则返回undefined
   * 3. 如果找到用户则返回用户信息
   */
  @Transactional()
  override async findUserByEmail(email: string): Promise<Maybe<UserProfile>> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return undefined;
    }

    return user;
  }

  @Transactional()
  async createUserByEmail(request: BaseSignUpByEmailRequest) {
    // TODO: 实现通过邮箱创建用户
    console.log('通过邮箱创建用户的功能还没有实现');
    return null;
    // const user = await this.userService.createOrUpdateEntity({
    //   ...request,
    //   status: UserProfileStatus.WAITING_FOR_EMAIL_APPROVAL,
    // });

    // const externalApproval =
    //   await this.externalApprovalService.createOrUpdateEntity({
    //     userId: user.id,
    //     user,
    //     code: generateRandomNumber(6).toString(),
    //     approvalType: ApprovalType.REGISTRATION,
    //   });

    // return {
    //   user,
    //   externalApproval,
    // };
  }

  // public createSsoUser(tenantId: string, email: string, firstName: string, lastName: string, roles: UserRole[], userProfileId?: string): Promise<JwtTokensPayload> {
  //   throw new Error('Method not implemented.');
  // }
  // public saveRefreshToken(userId: string, token: string): Promise<void> {
  //   throw new Error('Method not implemented.');
  // }
  // public approveSignUp(approveId: string, code: string): Promise<boolean> {
  //   throw new Error('Method not implemented.');
  // }
  // private readonly logger = new Logger(AuthUserService.name);

}
