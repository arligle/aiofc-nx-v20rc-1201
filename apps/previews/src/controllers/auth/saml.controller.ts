import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FastifyReply, FastifyRequest } from 'fastify';
import { SamlService } from '../../services';
import { SkipAuth } from '@aiofc/auth';
import { GenerateMetadataRequest } from './vo/saml.dto';
import { ClsStore } from '../../common/vo/cls-store';
import { ClsService } from '@aiofc/nestjs-cls';

/**
 * SAML认证控制器
 * 处理SAML SSO相关的请求
 * @ApiTags('Auth') - Swagger文档标签
 */
@ApiTags('Auth')
@Controller({
  path: 'auth/saml/sso', // SAML SSO相关接口的基础路径
  version: '1', // API版本
})
export class SamlController {
  constructor(
    private readonly clsStore: ClsService<ClsStore>, // 注入CLS存储服务,用于存储租户ID等上下文信息
    private readonly samlService: SamlService, // 注入SAML服务,处理SAML相关业务逻辑
  ) {}

  /**
   * 生成SAML元数据
   * 用于向身份提供商(IdP)提供服务提供商(SP)的元数据信息
   * @param req - Fastify请求对象
   * @param res - Fastify响应对象
   * @param request - 包含tenantId和samlConfigurationId的请求参数
   * @returns XML格式的SAML元数据
   */
  @Get('metadata')
  @SkipAuth() // 跳过认证,因为这是公开接口
  public async samlMetadata(
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
    @Query() request: GenerateMetadataRequest,
  ) {
    // 将租户ID存储到CLS中,用于后续业务处理
    this.clsStore.set('tenantId', request.tenantId);

    // 调用SAML服务生成元数据
    const metadata = await this.samlService.generateMetadata(
      request.samlConfigurationId,
      req,
      res,
    );

    // 设置响应头为XML格式
    res.header('Content-Type', 'application/xml');
    // 返回SAML元数据
    res.send(metadata);
  }
}
