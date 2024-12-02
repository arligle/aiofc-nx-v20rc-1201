import { PaginateConfig, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Never } from '@aiofc/common-types';
import { LimitOptions } from './vo/limit-options.interface';
import { IBaseEntity } from '../entity/base-entity-interface';
/**
 * @description 以抽象类的形式描述了一个通用的存储库形态，定义了一些通用的方法，如：
 * upsert、create、update、updatePartial、updateByQuery、
 * count、findAll、findAllPaginated、findById、findOne、delete、
 * entityName、presetWhereOptions
 * 这些方法的具体实现由继承的类来实现
 * @export
 * @abstract
 * @class AbstractRepository
 * @template ENTITY
 * @template ID
 * @template FIND_OPTIONS
 * @template FIELDS_REQUIRED_FOR_UPDATE
 * @template AUTO_GENERATED_FIELDS
 */
export abstract class AbstractRepository<
  ENTITY extends IBaseEntity,
  ID extends keyof ENTITY,
  FIND_OPTIONS,
  FIELDS_REQUIRED_FOR_UPDATE extends keyof ENTITY = ID,
  AUTO_GENERATED_FIELDS extends keyof ENTITY = keyof IBaseEntity | ID,
> {
  abstract upsert(
    entity:
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Partial<Never<Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>>>)
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>),
  ): Promise<ENTITY>;

  abstract upsert(
    entities: Array<
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Partial<Never<Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>>>)
      | (Omit<ENTITY, AUTO_GENERATED_FIELDS | FIELDS_REQUIRED_FOR_UPDATE> &
          Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>)
    >,
  ): Promise<ENTITY[]>;

  /**
   * create entity if it already exists -> throw error
   * */
  abstract create(
    entity: Omit<ENTITY, AUTO_GENERATED_FIELDS> & Partial<Pick<ENTITY, ID>>,
  ): Promise<ENTITY>;

  abstract create(
    entities: Array<
      Omit<ENTITY, AUTO_GENERATED_FIELDS> & Partial<Pick<ENTITY, ID>>
    >,
  ): Promise<Array<ENTITY>>;

  /**
   * update entity if it doesn't exists -> throw error
   * */
  abstract update(
    entity: Omit<ENTITY, AUTO_GENERATED_FIELDS> &
      Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>,
  ): Promise<ENTITY>;

  abstract update(
    entities: Array<
      Omit<ENTITY, AUTO_GENERATED_FIELDS> &
        Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>
    >,
  ): Promise<Array<ENTITY>>;

  /**
   * update entity partial if it doesn't exist -> throw error
   * */
  abstract updatePartial(
    entity: Partial<Omit<ENTITY, AUTO_GENERATED_FIELDS>> &
      Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>,
  ): Promise<Partial<ENTITY>>;

  abstract updatePartial(
    entities: Array<
      Partial<Omit<ENTITY, AUTO_GENERATED_FIELDS>> &
        Pick<ENTITY, FIELDS_REQUIRED_FOR_UPDATE>
    >,
  ): Promise<Array<Partial<ENTITY>>>;

  /**
   * */
  abstract updateByQuery(
    data: Partial<Omit<ENTITY, AUTO_GENERATED_FIELDS>>,
    query: FIND_OPTIONS,
  ): Promise<number>;

  abstract count(query?: FIND_OPTIONS): Promise<number>;

  abstract findAll(
    query?: FIND_OPTIONS,
    limitOptions?: LimitOptions,
  ): Promise<ENTITY[]>;

  // todo replace to use generalized types to do not belong to any specific orm, now it bind to the typeorm
  abstract findAllPaginated(
    query: PaginateQuery,
    config: PaginateConfig<ENTITY>,
  ): Promise<Paginated<ENTITY>>;

  abstract findById(id: ENTITY[ID]): Promise<ENTITY | undefined>;
  abstract findById(ids: Array<ENTITY[ID]>): Promise<Array<ENTITY>>;
  abstract findOne(where: FIND_OPTIONS): Promise<ENTITY | undefined>;

  abstract delete(criteria: ENTITY[ID]): Promise<boolean>;
  abstract delete(criteria: Array<ENTITY[ID]>): Promise<boolean>;

  /**
   * usually it's just a class name, but it can be a table name or any other entity identifier, useful for i18n keys
   * */
  abstract entityName(): string;

  /**
   * Used for auto filter population, useful for permission systems, global filters for security like by tenant id,
   * or any other creative filters
   * */
  protected presetWhereOptions(criteria: FIND_OPTIONS): FIND_OPTIONS {
    return criteria;
  }
}
