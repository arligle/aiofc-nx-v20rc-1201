
import { AbstractRepository, IBaseTrackedEntity, ITrackedRepository } from '@aiofc/persistence-base';
import { BaseEntityService } from './base-entity.service';
/**
 * @description 以泛型类的形式继承了基础实体服务类BaseEntityService，
 * 并增加了两个方法用于数据的可追踪，包括：归档、恢复
 * @export
 * @class BaseTrackedEntityService
 * @template ENTITY
 * @template ID
 * @template REPOSITORY
 * @template FIELDS_REQUIRED_FOR_UPDATE
 * @template AUTO_GENERATED_FIELDS
 */
export class BaseTrackedEntityService<
  ENTITY extends IBaseTrackedEntity,
  ID extends keyof ENTITY,
  REPOSITORY extends ITrackedRepository<ENTITY, ID, unknown> &
    AbstractRepository<
      ENTITY,
      ID,
      unknown,
      FIELDS_REQUIRED_FOR_UPDATE,
      AUTO_GENERATED_FIELDS
    >,
  FIELDS_REQUIRED_FOR_UPDATE extends keyof ENTITY = ID,
  AUTO_GENERATED_FIELDS extends keyof ENTITY = ID | keyof IBaseTrackedEntity,
> extends BaseEntityService<
  ENTITY,
  ID,
  REPOSITORY,
  FIELDS_REQUIRED_FOR_UPDATE,
  AUTO_GENERATED_FIELDS
> {
  constructor(repository: REPOSITORY) {
    super(repository);
  }
  // 归档（软删除/逻辑删除）
  archive(id: ENTITY[ID] | Array<ENTITY[ID]>): Promise<boolean> {
    return Array.isArray(id)
      ? this.repository.archive(id)
      : this.repository.archive(id);
  }
  // 恢复(取消归档)
  restore(id: ENTITY[ID] | Array<ENTITY[ID]>): Promise<boolean> {
    return Array.isArray(id)
      ? this.repository.restore(id)
      : this.repository.restore(id);
  }
}
