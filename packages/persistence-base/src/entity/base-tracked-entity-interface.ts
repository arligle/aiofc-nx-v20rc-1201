import { IBaseEntity } from './base-entity-interface';
// 基础的可追踪的实体接口，继承了 BaseEntity
export interface IBaseTrackedEntity extends IBaseEntity {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
