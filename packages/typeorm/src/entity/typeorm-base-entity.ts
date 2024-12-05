import { IBaseEntity } from '@aiofc/persistence-base';
import {
  BaseEntity,
} from 'typeorm';
/**
 * BaseEntity 来自于 TypeORM，是所有实体的基本抽象实体，在 ActiveRecord 模式中使用。
 * https://github1s.com/typeorm/typeorm/blob/master/src/repository/BaseEntity.ts
 * TheBaseEntity 即原来的 EntityHelper
 */
export abstract class TypeormBaseEntity extends BaseEntity implements IBaseEntity{}

/*
真正的功能实现从这里开始，通过继承 Typeorm的BaseEntity 获得了 TypeORM 定义的功能
*/