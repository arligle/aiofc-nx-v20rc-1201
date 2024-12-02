import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TenantService } from '../../services/tenants/tenant.service';

@ApiTags('Tenants')
@Controller(  'tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantService) {}


  @Post('setup')
  async setup() {
    return await this.tenantsService.setupTenant(
      '方策科技', // 租户的名称
      'yfc', // 同租户的友好标识符
      '1', // 租户的所有者

    );
  }
}
