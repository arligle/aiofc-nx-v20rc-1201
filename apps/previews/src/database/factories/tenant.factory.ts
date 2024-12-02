import { setSeederFactory } from 'typeorm-extension';
import { Tenant } from '../entities';
import { plainToInstance } from 'class-transformer';
import { TenantStatus } from '../entities/tenants/vo/tenant-status.enum';
import { isMeta } from './utils/functions';
import { faker } from '@faker-js/faker';
import { ExcludeKeys } from '@aiofc/common-types';
import { DEFAULT_CREATE_ENTITY_EXCLUDE_LIST } from '@aiofc/typeorm';

export const tenantFactory = setSeederFactory(Tenant, (_, meta) => {
  const plainTenant = {
    tenantId: faker.string.uuid(),
    tenantName: faker.company.name(),
    tenantStatus: TenantStatus.ACTIVE,
    tenantFriendlyIdentifier: faker.company.name(),
    ownerId: '',
  } satisfies ExcludeKeys<
    Tenant,
    typeof DEFAULT_CREATE_ENTITY_EXCLUDE_LIST | 'id' | 'version'
  >;

  if (isMeta(meta)) {
    plainTenant.ownerId = meta.ownerId;
  }

  return plainToInstance(Tenant, plainTenant);
});
