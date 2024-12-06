import { Injectable } from '@nestjs/common';
import { BaseEntityService } from '@aiofc/service-base';
import { SamlConfiguration } from '../database/entities';
import { SamlConfigurationRepository } from '../repositories';

@Injectable()
export class SamlConfigurationService extends BaseEntityService<
  SamlConfiguration,
  'id',
  SamlConfigurationRepository
> {
  constructor(repository: SamlConfigurationRepository) {
    super(repository);
  }
}