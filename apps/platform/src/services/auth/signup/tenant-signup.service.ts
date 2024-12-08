import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { AbstractSignupService } from './abstract-signup.service';
import { SignUpByEmailResponse, SignUpByEmailWithTenantCreationRequest } from 'apps/platform/src/controllers/auth/vo/sign-up.dto';
import AbstractAuthUserService from '../abstract-auth-user.service';
import { Transaction } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { ConflictEntityCreationException } from '@aiofc/exceptions';
import { hashPassword } from '@aiofc/utils';


@Injectable()
export class TenantSignupService extends AbstractSignupService<SignUpByEmailWithTenantCreationRequest> {
  private readonly logger = new Logger(TenantSignupService.name);

  constructor(
    // 注入用户认证服务,用于处理用户认证相关操作
    private readonly userAuthService: AbstractAuthUserService,
  ) {
    super();
  }

  @Transactional()
  async signUp(createUserDto: SignUpByEmailWithTenantCreationRequest): Promise<SignUpByEmailResponse> {
    // 检查用户是否已存在
    const existingUser = await this.userAuthService.findUserByEmail(
      createUserDto.email,
    );
    // 如果用户已存在,记录警告日志并抛出冲突异常
    if (existingUser) {
      // 使用logger记录警告信息
      this.logger.warn(
        `User trying to register with same email again: ${createUserDto.email}`,
        {
          userId: existingUser.id,
          ignore: true,
        },
      );
      // 抛出实体创建冲突异常,表明该邮箱已被注册
      throw new ConflictEntityCreationException(
        'User',
        'email',
        createUserDto.email,
      );
    }

    const hashedPassword = await hashPassword(createUserDto.password);

    const { user: userProfile, externalApproval } =
      await this.userAuthService.createUserByEmail({
        ...createUserDto,
        password: hashedPassword,
      });

    return Object.assign({
      approvalId: 'temp-id',
      jwtPayload: {
        accessToken: '',
        refreshToken: '',
      }
    });
    };

}
