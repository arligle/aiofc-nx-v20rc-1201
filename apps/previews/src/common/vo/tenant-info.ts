import { TenantInfo as DefaultTenantInfo } from '@aiofc/auth';
import { RoleType } from '../../database/entities/roles/types/default-role.enum';

export interface TenantInfo extends DefaultTenantInfo<RoleType> {}
