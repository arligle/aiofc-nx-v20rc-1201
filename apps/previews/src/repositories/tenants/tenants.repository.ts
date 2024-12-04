import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from '../../database/entities';
import { InjectDataSource } from '@aiofc/nestjs-typeorm';
import { BaseTypeormTenantedEntityRepository as BaseRepository } from '@aiofc/typeorm';
import { TenantClsStore } from '@aiofc/persistence-base';
import { ClsService } from '@aiofc/nestjs-cls';

@Injectable()
export class TenantsRepository extends BaseRepository<Tenant, 'id'> {
  constructor(
    @InjectDataSource()
    readonly ds: DataSource,
    cls: ClsService<TenantClsStore>
  ) {
    super(Tenant, ds, 'id', cls);
  }
}
