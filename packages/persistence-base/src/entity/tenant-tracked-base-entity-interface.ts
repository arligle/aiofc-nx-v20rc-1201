import { ITenantBaseEntity } from './tenant-base-entity-interface';
import { ITrackedBaseEntity } from './tracked-base-entity-interface';

// 基础的可追踪的租户实体接口，所以需要继承 BaseTenantedEntity 和 BaseTrackedEntity
export interface ITenantTrackedBaseEntity
  extends ITenantBaseEntity,
    ITrackedBaseEntity {}
