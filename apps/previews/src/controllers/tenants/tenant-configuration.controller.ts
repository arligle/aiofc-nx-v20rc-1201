import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { I18nService } from '@aiofc/i18n';
import { SamlConfigurationService, TenantService } from '../../services';

import {
  SetupSamlConfiguration,
  SetupSamlConfigurationResponseDTO,
} from './vo/saml-configuration.dto';
import { I18nTranslations } from '../../generated/i18n.generated';
import { map } from '@aiofc/validation';

/**
 * 租户配置控制器
 *
 * @description
 * 该控制器负责处理租户相关的配置操作，包括SAML配置等
 */
@ApiTags('Tenants')
@Controller({
  path: 'tenants/configuration', // 配置路径为 tenants/configuration
  version: '1', // API版本为1
})
export class TenantsConfigurationController {
  /**
   * 构造函数,注入所需的服务
   * @param i18 国际化服务,用于处理多语言
   * @param tenantsService 租户服务
   * @param samlConfigurationService SAML配置服务
   */
  constructor(
    private readonly i18: I18nService<I18nTranslations>,
    private readonly tenantsService: TenantService,
    private readonly samlConfigurationService: SamlConfigurationService,
  ) {}

  /**
   * 设置SAML配置
   *
   * @description
   * 处理SAML配置的POST请求,创建或更新SAML配置信息
   *
   * @param request SAML配置请求对象
   * @returns 返回配置结果和成功消息
   */
  @Post('saml')
  @HttpCode(HttpStatus.OK)
  public async setupSaml(
    @Body() request: SetupSamlConfiguration,
  ): Promise<SetupSamlConfigurationResponseDTO> {
    return this.samlConfigurationService
      .createOrUpdateEntity(request)
      .then((result) => {
        const responseDTO = map(result, SetupSamlConfigurationResponseDTO);
        return {
          ...responseDTO,
          message: this.i18.t('tenant.SAML_CONFIGURATION_FINISHED'), // 返回SAML配置完成的国际化消息
        };
      });
  }
}
