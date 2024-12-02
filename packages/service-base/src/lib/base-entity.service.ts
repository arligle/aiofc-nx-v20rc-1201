import { Transactional } from 'typeorm-transactional';

import { AbstractBaseService } from './abstract-base.service';
import { PaginateConfig, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ClassConstructor } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { map } from '@aiofc/validation';
import { Never } from '@aiofc/common-types';
import { ObjectNotFoundException } from '@aiofc/exceptions';
import { AbstractRepository, IBaseEntity } from '@aiofc/persistence-base';
/**
 * @description 以泛型类的形式继承了抽象基础服务类AbstractBaseService，
 * 并实现了具体的方法，这些实现方法都带有TypeORM的事务注解@Transactional()，具有事务处理的能力，
 * 因此，这个类可以应用在TypeORM的实体操作中,因为它已经不是一个抽象类了。
 * @export
 * @class BaseEntityService
 * @template ENTITY
 * @template ID
 * @template REPOSITORY
 * @template FIELDS_REQUIRED_FOR_UPDATE
 * @template AUTO_GENERATED_FIELDS
 */
export class BaseEntityService<
  ENTITY extends IBaseEntity,
  ID extends keyof ENTITY,
  REPOSITORY extends AbstractRepository<
    ENTITY,
    ID,
    unknown,
    FIELDS_REQUIRED_FOR_UPDATE,
    AUTO_GENERATED_FIELDS
  >,
  FIELDS_REQUIRED_FOR_UPDATE extends keyof ENTITY = ID,
  AUTO_GENERATED_FIELDS extends keyof ENTITY = ID,
> extends AbstractBaseService<
  ENTITY,
  ID,
  FIELDS_REQUIRED_FOR_UPDATE,
  AUTO_GENERATED_FIELDS
> {
  constructor(protected readonly repository: REPOSITORY) {
    super();
  }
/*
 * @description
  传入一个ENTITY类型的对象作为参数
  函数自动完成两个操作：
  从ENTITY中排除自动生成的字段
  从ENTITY中选择ID字段，然后将其变成可选的
  最后返回一个ENTITY类型的对象
 */
create(
    entity: Omit<ENTITY, AUTO_GENERATED_FIELDS> & Partial<Pick<ENTITY, ID>>,
  ): Promise<ENTITY>;

  create(
    entities: Array<
      Omit<ENTITY, AUTO_GENERATED_FIELDS> & Partial<Pick<ENTITY, ID>>
    >,
  ): Promise<Array<ENTITY>>;

  @Transactional()
  override create(
    entities:
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS> & Partial<Pick<ENTITY, ID>>)
      | Array<Omit<ENTITY, AUTO_GENERATED_FIELDS> & Partial<Pick<ENTITY, ID>>>,
  ): Promise<ENTITY | ENTITY[]> {
    return Array.isArray(entities)
      ? this.repository.create(entities)
      : this.repository.create(entities);
  }
  update(
    entity: Omit<ENTITY, AUTO_GENERATED_FIELDS> &
      Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>,
  ): Promise<ENTITY>;

  update(
    entities: Array<
      Omit<ENTITY, AUTO_GENERATED_FIELDS> &
        Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>
    >,
  ): Promise<Array<ENTITY>>;

  @Transactional()
  override update(
    entity:
      | Array<
          Omit<ENTITY, AUTO_GENERATED_FIELDS> &
            Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>
        >
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS> &
          Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>),
  ): Promise<ENTITY | ENTITY[]> {
    return Array.isArray(entity)
      ? this.repository.update(entity)
      : this.repository.update(entity);
  }

  upsert(
    entity:
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Partial<Never<Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>>>)
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>),
  ): Promise<ENTITY>;

  upsert(
    entities: Array<
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Partial<Never<Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>>>)
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>)
    >,
  ): Promise<ENTITY[]>;

  @Transactional()
  override upsert(
    entities:
      | Array<
          | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
              Partial<Never<Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>>>)
          | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
              Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>)
        >
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Partial<Never<Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>>>)
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>),
  ): Promise<ENTITY | ENTITY[]> {
    return Array.isArray(entities)
      ? this.repository.upsert(entities)
      : this.repository.upsert(entities);
  }

  partialUpdate(
    entity: Partial<Omit<ENTITY, AUTO_GENERATED_FIELDS>> &
      Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>,
  ): Promise<Partial<ENTITY>>;

  partialUpdate(
    entities: Array<
      Partial<Omit<ENTITY, AUTO_GENERATED_FIELDS>> &
        Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>
    >,
  ): Promise<Array<Partial<ENTITY>>>;

  @Transactional()
  override partialUpdate(
    entities:
      | Array<
          Partial<Omit<ENTITY, AUTO_GENERATED_FIELDS>> &
            Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>
        >
      | (Partial<Omit<ENTITY, AUTO_GENERATED_FIELDS>> &
          Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>),
  ): Promise<Partial<ENTITY> | Array<Partial<ENTITY>>> {
    return Array.isArray(entities)
      ? this.repository.updatePartial(entities)
      : this.repository.updatePartial(entities);
  }

  findById(id: ENTITY[ID]): Promise<ENTITY>;
  findById(id: ENTITY[ID], throwExceptionIfNotFound: true): Promise<ENTITY>;
  findById(
    id: ENTITY[ID],
    throwExceptionIfNotFound: false,
  ): Promise<ENTITY | undefined>;
  findById(ids: Array<ENTITY[ID]>): Promise<Array<ENTITY>>;

  @Transactional()
  override async findById(
    id: Array<ENTITY[ID]> | ENTITY[ID],
    throwExceptionIfNotFound = true,
  ): Promise<undefined | ENTITY | Array<ENTITY>> {
    const ids = Array.isArray(id) ? id : [id];

    const result = await this.repository.findById(ids);

    if (
      !Array.isArray(id) &&
      ids.length === 1 &&
      throwExceptionIfNotFound &&
      result.length === 0
    ) {
      throw new ObjectNotFoundException(this.repository.entityName());
    }

    return Array.isArray(id) ? result : result[0];
  }

  @Transactional()
  override async findAllPaginated<T = ENTITY>(
    query: PaginateQuery,
    config: PaginateConfig<ENTITY>,
    clazz?: ClassConstructor<T>,
    options?: ClassTransformOptions,
  ): Promise<Paginated<T>> {
    const result = await this.repository.findAllPaginated(query, config);

    if (clazz) {
      const data = map(result.data, clazz, options);
      return {
        ...result,
        data,
      } as never as Paginated<T>;
    }

    return result as never as Paginated<T>;
  }

  @Transactional()
  override findAll(page = 0, limit = 100): Promise<ENTITY[]> {
    return this.repository.findAll(undefined, {
      limit,
      offset: page * limit,
    });
  }

  @Transactional()
  override delete(id: ENTITY[ID] | Array<ENTITY[ID]>): Promise<boolean> {
    return Array.isArray(id)
      ? this.repository.delete(id)
      : this.repository.delete(id);
  }
}
