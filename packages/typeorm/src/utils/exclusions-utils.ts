import { AbstractBaseTrackedEntity } from "../entity/abstract-base-tracked.entity";
import { AbstractBaseEntity } from "../entity/abstract-base.entity";

export const DEFAULT_ENTITY_EXCLUDE_LIST = [
  'hasId',
  'setEntityName',
  'recover',
  'softRemove',
  'reload',
  'save',
] as Array<keyof AbstractBaseEntity>;

export const DEFAULT_CREATE_ENTITY_EXCLUDE_LIST = [
  ...DEFAULT_ENTITY_EXCLUDE_LIST,
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'version',
] as Array<keyof AbstractBaseTrackedEntity>;

export const DEFAULT_UPDATE_ENTITY_EXCLUDE_LIST = [
  ...DEFAULT_ENTITY_EXCLUDE_LIST,
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as Array<keyof AbstractBaseEntity | 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
