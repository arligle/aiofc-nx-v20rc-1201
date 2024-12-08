import { Injectable, Logger } from '@nestjs/common';
import { AbstractSignupService } from './abstract-signup.service';
import { SignUpByEmailWithTenantCreationRequest } from '../../../controllers/auth/vo/sign-up.dto';
import { ConflictEntityCreationException } from '@aiofc/exceptions';
import { Transactional } from 'typeorm-transactional';
import AbstractAuthUserService from '../abstract-auth-user.service';
import { TenantService } from '../../tenants/tenant.service';
import { UserRoleService } from '../../roles/user-role.service';
import { UserTenantAccountService } from '../../users/user-tenant-account.service';
import { UserAccountStatus } from '../../../database/entities/users/types/user-account-status.enum';
import { AbstractTokenBuilderService } from '@aiofc/auth';
import { UserProfile } from '../../../database/entities';
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../../../common/vo/token-payload';
import { UserService } from '../../users/user.service';
import { hashPassword } from '@aiofc/utils';

@Injectable()
export class TenantSignupService extends AbstractSignupService<SignUpByEmailWithTenantCreationRequest> {
  private readonly logger = new Logger(TenantSignupService.name);

  constructor(
    // 注入租户服务,用于处理租户相关操作
    private readonly tenantService: TenantService,
    // 注入用户认证服务,用于处理用户认证相关操作
    private readonly userAuthService: AbstractAuthUserService,
    // 注入用户服务,用于处理用户相关操作
    private readonly userService: UserService,
    // 注入用户租户账户服务,用于处理用户与租户关联的操作
    private readonly userTenantAccountService: UserTenantAccountService,
    // 注入角色服务,用于处理用户角色相关操作
    private readonly roleService: UserRoleService,
    // 注入令牌构建服务,用于生成JWT token
    private readonly tokenBuilderService: AbstractTokenBuilderService<
      UserProfile,
      AccessTokenPayload,
      RefreshTokenPayload
    >,
  ) {
    super();
  }

  @Transactional()
  async signUp(createUserDto: SignUpByEmailWithTenantCreationRequest) {
    // 通过邮箱查找是否存在已注册用户
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

    const tenant = await this.tenantService.setupTenant(
      createUserDto.companyName,
      createUserDto.companyIdentifier,
      userProfile.id,
    );

    const adminRole = await this.roleService.findDefaultAdminRole();

    this.logger.log(
      `Creating a new user, with email address: ${createUserDto.email}`,
    );

    await this.userTenantAccountService.createOrUpdateEntity({
      tenantId: tenant.id,
      userProfileId: userProfile.id,
      userProfile,
      roles: [adminRole],
      userStatus: UserAccountStatus.ACTIVE,
    });

    const userUpdated = await this.userService.findOne({
      relations: ['userTenantsAccounts', 'userTenantsAccounts.roles'],
      where: {
        id: userProfile.id,
      },
    });

    return {
      jwtPayload: this.tokenBuilderService.buildTokensPayload(userUpdated),
      approvalId: externalApproval.id,
    };
  }
}
