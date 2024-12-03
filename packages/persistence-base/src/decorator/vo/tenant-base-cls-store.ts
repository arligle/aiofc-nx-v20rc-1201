import type { ClsStore } from '@aiofc/nestjs-cls';
export interface TenantClsStore extends ClsStore {
  tenantId?: string;
}
