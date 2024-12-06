import { Injectable, Logger } from '@nestjs/common';
import { AbstractSignupService } from './signup.service.interface';
import {
  BaseSignUpByEmailRequest,
  SignUpByEmailResponse,
} from '../../../controllers/auth/vo/sign-up.dto';
import { ConflictEntityCreationException } from '@aiofc/exceptions';
import { Transactional } from 'typeorm-transactional';
import AbstractAuthUserService from '../abstract-auth-user.service';
import { AbstractTokenBuilderService } from '@aiofc/auth';
import { UserProfile } from '../../../database/entities';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../../../common/vo/token-payload';
import { hashPassword } from '@aiofc/utils';

// 使用@Injectable装饰器标记该服务可被依赖注入
@Injectable()
// SignupService类继承自AbstractSignupService,并使用BaseSignUpByEmailRequest作为泛型参数
export class SignupService extends AbstractSignupService<BaseSignUpByEmailRequest> {
  // 创建一个私有的日志记录器实例
  private readonly logger = new Logger(SignupService.name);

  // 构造函数,注入所需的服务
  constructor(
    // 注入用户认证服务
    private readonly userAuthService: AbstractAuthUserService,
    // 注入令牌构建服务,用于生成JWT token
    private readonly tokenBuilderService: AbstractTokenBuilderService<
      UserProfile,
      AccessTokenPayload,
      RefreshTokenPayload
    >,
  ) {
    super();
  }

  // 使用@Transactional装饰器确保数据库操作的事务性
  @Transactional()
  // 实现注册方法
  async signUp(
    createUserDto: BaseSignUpByEmailRequest,
  ): Promise<SignUpByEmailResponse> {
    // 检查邮箱是否已被注册
    const existingUser = await this.userAuthService.findUserByEmail(
      createUserDto.email,
    );

    // 如果邮箱已存在,记录警告并抛出异常
    if (existingUser) {
      this.logger.warn(
        `User trying to register with same email again: ${createUserDto.email}`,
        {
          userId: existingUser.id,
          ignore: true,
        },
      );

      throw new ConflictEntityCreationException(
        'User',
        'email',
        createUserDto.email,
      );
    }
    // 对密码进行哈希处理
    const hashedPassword = await hashPassword(createUserDto.password);

    // 记录创建新用户的日志
    this.logger.log(
      `Creating a new user, with email address: ${createUserDto.email}`,
    );

    // 创建新用户
    const { user, externalApproval } =
      await this.userAuthService.createUserByEmail({
        ...createUserDto,
        password: hashedPassword,
      });

    // 返回注册结果,包含审批ID和JWT令牌
    return {
      approvalId: externalApproval.id,
      jwtPayload: this.tokenBuilderService.buildTokensPayload(user),
    };
  }
}
