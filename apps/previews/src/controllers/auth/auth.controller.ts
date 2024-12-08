import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  I18n,
  I18nContext,
  I18nService,
  I18nValidationException,
} from '@aiofc/i18n';

import {
  CurrentUser,
  IRefreshTokenPayload,
  RefreshJwtAuthGuard,
  SkipAuth,
} from '@aiofc/auth';
import { ApiConflictResponsePaginated } from '@aiofc/common-types';
import {
  SignUpByEmailRequest,
  SignUpByEmailResponseDTO,
  SignUpByEmailWithTenantCreationRequest,
} from './vo/sign-up.dto';
import { ApproveSignUpRequest } from './vo/approve.dto';
import { I18nTranslations } from '../../generated/i18n.generated';
import { SignInRequest, SignInResponseDTO } from './vo/sign-in.dto';
import { AbstractSignupService } from '../../services/auth/signup/abstract-signup.service';
import { InitiateSamlLoginRequest } from './vo/saml.dto';
import { ClsStore } from '../../common/vo/cls-store';
import { validate } from 'class-validator';
import { map } from '@aiofc/validation';
import { ClsService } from '@aiofc/nestjs-cls';
import { decodeBase64StringObjectFromUrl } from '@aiofc/utils';
import { AuthService, SamlService } from '../../services';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
@SkipAuth()
export class AuthController {
  constructor(
    // 注入你需要使用的提供者
    private readonly authService: AuthService, // 认证服务
    private readonly clsService: ClsService<ClsStore>, // CLS服务用于处理请求上下文
    private readonly signUpService: AbstractSignupService<SignUpByEmailRequest>, // 注册服务
    private readonly samlService: SamlService, // SAML服务用于SSO登录
    private readonly i18: I18nService, // 国际化服务
  ) {}

  @Post('signup')
  @ApiConflictResponsePaginated(
    'Appears when user with such email already exists',
  )
  @HttpCode(HttpStatus.CREATED)  // 设置响应状态码为201 Created
  public async signUp(
    @I18n() i18n: I18nContext<I18nTranslations>,  // 注入i18n国际化上下文
    @Body() request: SignUpByEmailRequest,  // 获取请求体,类型为SignUpByEmailRequest
  ): Promise<SignUpByEmailResponseDTO> {  // 返回Promise<SignUpByEmailResponseDTO>类型
    // TODO: 根据选择的工作流,可以在这里返回token让用户直接登录
    return this.signUpService.signUp(request).then((response) => {
      const responseDTO = map(response, SignUpByEmailResponseDTO);  // 将响应映射为DTO
      return {
        ...responseDTO,
        message: i18n.t('user.FINISHED_REGISTRATION'),  // 添加注册完成的国际化消息
      };
    });
  }

  @Post('tenant-signup')  // 定义一个POST请求路由,路径为'tenant-signup'
  @ApiConflictResponsePaginated(  // 当发生409冲突错误时的分页响应格式
    'Appears when user with such email already exists',  // 当用户邮箱已存在时返回409冲突响应
  )
  @HttpCode(HttpStatus.CREATED)  // 设置响应状态码为201 Created
  public async signUpWithTenantCreation(  // 定义租户创建注册方法
    @I18n() i18n: I18nContext<I18nTranslations>,  // 注入i18n国际化上下文
    @Body() request: SignUpByEmailWithTenantCreationRequest,  // 获取请求体,类型为SignUpByEmailWithTenantCreationRequest
  ): Promise<SignUpByEmailResponseDTO> {  // 返回Promise<SignUpByEmailResponseDTO>类型
    // 根据选择的工作流,可以在这里返回token让用户直接登录
    return this.signUpService.signUp(request).then((response) => {  // 调用注册服务的signUp方法
      const responseDTO = map(response, SignUpByEmailResponseDTO);  // 将响应映射为DTO
      return {
        ...responseDTO,
        message: i18n.t('user.FINISHED_REGISTRATION'),  // 添加注册完成的国际化消息
      };
    });
  }

  /**
   * 根据选择的工作流,可以在这里返回token让用户直接登录,
   * 或者返回一些消息让用户去登录
   * 默认行为是强制用户登录并确保密码正确
   */
  @Post('approve-signup')  // 定义一个POST请求路由,路径为'approve-signup'
  @HttpCode(HttpStatus.OK)  // 设置响应状态码为200 OK
  public async approveSignup(
    @I18n() i18n: I18nContext,  // 注入i18n国际化上下文
    @Body() request: ApproveSignUpRequest,  // 获取请求体,类型为ApproveSignUpRequest
  ) {
    // 调用认证服务的approveUserEmail方法来验证用户邮箱
    await this.authService.approveUserEmail(request.id, request.code);

    // 返回邮箱验证成功的国际化消息
    return {
      message: this.i18.t('user.SUCCESSFULLY_APPROVED_EMAIL'),
    };
  }

  /**
   * 用户登录接口
   * @param i18n - 国际化上下文
   * @param request - 登录请求体,包含email和password
   * @returns 返回登录响应DTO,包含token信息和成功消息
   */
  @Post('signin') // 定义POST请求路由,路径为'signin'
  @HttpCode(HttpStatus.OK) // 设置响应状态码为200 OK
  public async signIn(
    @I18n() i18n: I18nContext, // 注入i18n国际化上下文
    @Body() request: SignInRequest, // 获取请求体,类型为SignInRequest
  ): Promise<SignInResponseDTO> { // 返回Promise<SignInResponseDTO>类型
    return this.authService
      .signIn(request.email, request.password) // 调用认证服务的signIn方法进行登录
      .then((tokens) => {
        const responseDTO = map(tokens, SignInResponseDTO); // 将token映射为响应DTO
        return {
          ...responseDTO,
          message: this.i18.t('user.SUCCESSFULLY_LOGGED_IN'), // 添加登录成功的国际化消息
        };
      });
  }

  /**
   * SAML SSO登录接口
   * @param req - Fastify请求对象
   * @param res - Fastify响应对象
   * @param request - SAML登录初始化请求
   * @returns 返回SAML登录响应
   */
  @Post('sso/saml/login') // 定义POST请求路由,路径为'sso/saml/login'
  @HttpCode(HttpStatus.OK) // 设置响应状态码为200 OK
  async samlLogin(
    @Req() req: FastifyRequest, // 注入Fastify请求对象
    @Res() res: FastifyReply, // 注入Fastify响应对象
    @Body() request: InitiateSamlLoginRequest, // 获取请求体,类型为InitiateSamlLoginRequest
  ) {
    // 调用SAML服务的login方法进行登录,传入请求参数和租户ID
    return this.samlService.login(request, req, res, {
      ...request,
      tenantId: this.clsService.get().tenantId, // 从CLS服务获取租户ID
    });
  }

  /**
   * SAML SSO登录确认接口
   * @param req - Fastify请求对象
   * @param res - Fastify响应对象
   * @returns 返回SAML登录响应
   */
  @Post('sso/saml/ac') // 定义POST请求路由,路径为'sso/saml/ac'
  @HttpCode(HttpStatus.OK) // 设置响应状态码为200 OK
  async samlAcknowledge(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // 从请求体中解码base64编码的RelayState字符串
    const relayState = decodeBase64StringObjectFromUrl(
      (req.body as any)?.RelayState,
    );

    // 将租户ID设置到CLS服务中
    this.clsService.set('tenantId', relayState.tenantId as string);

    // 将relayState映射为SAML登录初始化请求对象
    const initiateRequest = map(relayState, InitiateSamlLoginRequest);

    // 验证请求对象
    const validationErrors = await validate(initiateRequest);

    // 由于数据来自base64编码字符串,需要手动验证
    if (validationErrors.length > 0) {
      throw new I18nValidationException(validationErrors);
    }

    // 调用SAML服务的login方法完成登录
    return this.samlService.login(initiateRequest, req, res);
  }

  /**
   * 刷新访问令牌的接口
   * @param user - 刷新令牌载荷,包含用户邮箱等信息
   * @returns 返回新的访问令牌
   */
  @SkipAuth() // 跳过身份验证
  @Post('refresh-access-token') // 定义POST请求路由,路径为'refresh-access-token'
  @HttpCode(HttpStatus.OK) // 设置响应状态码为200 OK
  @UseGuards(RefreshJwtAuthGuard) // 使用刷新令牌守卫进行验证
  public async refreshAccessToken(@CurrentUser() user: IRefreshTokenPayload) {
    // 调用认证服务刷新访问令牌
    const token = await this.authService.refreshAccessToken(user.email);

    // 返回新的访问令牌
    return {
      accessToken: token,
    };
  }
}
