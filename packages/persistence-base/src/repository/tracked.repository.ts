import { IBaseTrackedEntity } from '../entity/base-tracked-entity-interface';
import { LimitOptions } from './vo/limit-options.interface';
/**
 * @description 以接口的形式定义了一个通用的带可追踪属性的存储库形态，
 * 定义了一些通用的方法，如：findAllWithArchived、archive、restore
 * 这些方法用于：查询所有记录（包括已归档的记录）、归档记录、恢复记录
 * 这些方法的具体实现由继承的类来实现
 * @export
 * @interface ITrackedRepository
 * @template ENTITY
 * @template ID
 * @template FIND_OPTIONS
 */
export interface ITrackedRepository<
  ENTITY extends IBaseTrackedEntity,
  ID extends keyof ENTITY,
  FIND_OPTIONS,
> {
  findAllWithArchived(
    opt: FIND_OPTIONS,
    limitOptions?: LimitOptions,
  ): Promise<ENTITY[]>;

  archive(criteria: ENTITY[ID]): Promise<boolean>;
  archive(criteria: Array<ENTITY[ID]>): Promise<boolean>;

  restore(criteria: ENTITY[ID]): Promise<boolean>;
  restore(criteria: Array<ENTITY[ID]>): Promise<boolean>;
}
