import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { SAMLConfiguration } from '../../database/entities';
import { InjectDataSource } from '@aiofc/nestjs-typeorm';
import { BaseTypeormTrackedEntityRepository as BaseRepository } from '@aiofc/typeorm';
@Injectable()
export class SamlConfigurationBaseRepository extends BaseRepository<
  SAMLConfiguration,
  'id'
> {
  constructor(
    @InjectDataSource()
    ds: DataSource,
  ) {
    super(SAMLConfiguration, ds, 'id');
  }
}
