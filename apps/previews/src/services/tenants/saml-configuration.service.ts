import { Injectable } from '@nestjs/common';
import { SAMLConfiguration } from '../../database/entities';
import { SamlConfigurationRepository } from '../../repositories';
import { BaseEntityService } from '@aiofc/service-base';

// import { BaseTenantEntityService } from '@aiofc/typeorm-service';

@Injectable()
export class SamlConfigurationService extends BaseEntityService<
  SAMLConfiguration,
  'id',
  SamlConfigurationRepository
> {
  constructor(samlConfigurationService: SamlConfigurationRepository) {
    super(samlConfigurationService);
  }
}
