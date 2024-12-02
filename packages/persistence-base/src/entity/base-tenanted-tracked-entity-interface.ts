import { IBaseTenantedEntity } from './base-tenanted-entity-interface';
import { IBaseTrackedEntity } from './base-tracked-entity-interface';

// 基础的可追踪的租户实体接口，所以需要继承 BaseTenantedEntity 和 BaseTrackedEntity
export interface IBaseTenantedTrackedEntity
  extends IBaseTenantedEntity,
    IBaseTrackedEntity {}
