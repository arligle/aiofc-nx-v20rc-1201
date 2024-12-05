import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SAMLConfiguration } from '../../database/entities';
import { ClsService } from '@aiofc/nestjs-cls';
import { InjectDataSource } from '@aiofc/nestjs-typeorm';
import { TenantClsStore } from '@aiofc/persistence-base';
import { BaseTypeormTenantedEntityRepository as BaseRepository } from '@aiofc/typeorm';
@Injectable()
export class SamlConfigurationRepository extends BaseRepository<
  SAMLConfiguration,
  'id'
> {
  constructor(
    @InjectDataSource()
    ds: DataSource,
    clsService: ClsService<TenantClsStore>,
  ) {
    super(SAMLConfiguration, ds, 'id', clsService);
  }
}
