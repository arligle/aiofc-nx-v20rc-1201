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
import { AbstractSignupService } from '../../services/auth/signup/signup.service.interface';
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
    private readonly authService: AuthService,
    private readonly clsService: ClsService<ClsStore>,
    private readonly signUpService: AbstractSignupService<SignUpByEmailRequest>,
    private readonly samlService: SamlService,
    private readonly i18: I18nService,
  ) {}

  @Post('signup')
  @ApiConflictResponsePaginated(
    'Appears when user with such email already exists',
  )
  @HttpCode(HttpStatus.CREATED)
  public async signUp(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() request: SignUpByEmailRequest,
  ): Promise<SignUpByEmailResponseDTO> {
    // depends on chosen workflow you can respond with tokens here and let user in
    return this.signUpService.signUp(request).then((response) => {
      const responseDTO = map(response, SignUpByEmailResponseDTO);
      return {
        ...responseDTO,
        message: i18n.t('user.FINISHED_REGISTRATION'),
      };
    });
  }

  @Post('tenant-signup')
  @ApiConflictResponsePaginated(
    'Appears when user with such email already exists',
  )
  @HttpCode(HttpStatus.CREATED)
  public async signUpWithTenantCreation(
    @I18n() i18n: I18nContext<I18nTranslations>,
    @Body() request: SignUpByEmailWithTenantCreationRequest,
  ): Promise<SignUpByEmailResponseDTO> {
    // depends on chosen workflow you can respond with tokens here and let user in
    return this.signUpService.signUp(request).then((response) => {
      const responseDTO = map(response, SignUpByEmailResponseDTO);
      return {
        ...responseDTO,
        message: i18n.t('user.FINISHED_REGISTRATION'),
      };
    });
  }

  /**
   @description depends on chosen workflow you can respond with tokens here and let user in,
    or you can respond with some message and let user to login
    default behavior is to force user to login and make sure his password is correct
   */
  @Post('approve-signup')
  @HttpCode(HttpStatus.OK)
  public async approveSignup(
    @I18n() i18n: I18nContext,
    @Body() request: ApproveSignUpRequest,
  ) {
    await this.authService.approveUserEmail(request.id, request.code);

    return {
      message: this.i18.t('user.SUCCESSFULLY_APPROVED_EMAIL'),
    };
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  public async signIn(
    @I18n() i18n: I18nContext,
    @Body() request: SignInRequest,
  ): Promise<SignInResponseDTO> {
    return this.authService
      .signIn(request.email, request.password)
      .then((tokens) => {
        const responseDTO = map(tokens, SignInResponseDTO);
        return {
          ...responseDTO,
          message: this.i18.t('user.SUCCESSFULLY_LOGGED_IN'),
        };
      });
  }

  @Post('sso/saml/login')
  @HttpCode(HttpStatus.OK)
  async samlLogin(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Body() request: InitiateSamlLoginRequest,
  ) {
    return this.samlService.login(request, req, res, {
      ...request,
      tenantId: this.clsService.get().tenantId,
    });
  }

  @Post('sso/saml/ac')
  @HttpCode(HttpStatus.OK)
  async samlAcknowledge(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    const relayState = decodeBase64StringObjectFromUrl(
      (req.body as any)?.RelayState,
    );

    this.clsService.set('tenantId', relayState.tenantId as string);

    const initiateRequest = map(relayState, InitiateSamlLoginRequest);

    const validationErrors = await validate(initiateRequest);

    // manual validation is required because data come in base64 encoded string
    if (validationErrors.length > 0) {
      throw new I18nValidationException(validationErrors);
    }

    return this.samlService.login(initiateRequest, req, res);
  }

  @SkipAuth()
  @Post('refresh-access-token')
  @HttpCode(HttpStatus.OK)
  @UseGuards(RefreshJwtAuthGuard)
  public async refreshAccessToken(@CurrentUser() user: IRefreshTokenPayload) {
    const token = await this.authService.refreshAccessToken(user.email);

    return {
      accessToken: token,
    };
  }
}
