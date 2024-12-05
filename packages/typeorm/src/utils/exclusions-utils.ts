
import { TrackedTypeormBaseEntity } from "../entity/tracked-typeorm-base-entity";
import { TypeormBaseEntity } from "../entity/typeorm-base-entity";


export const DEFAULT_ENTITY_EXCLUDE_LIST = [
  'hasId',
  'setEntityName',
  'recover',
  'softRemove',
  'reload',
  'save',
] as Array<keyof TypeormBaseEntity>;

export const DEFAULT_CREATE_ENTITY_EXCLUDE_LIST = [
  ...DEFAULT_ENTITY_EXCLUDE_LIST,
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'version',
] as Array<keyof TrackedTypeormBaseEntity>;

export const DEFAULT_UPDATE_ENTITY_EXCLUDE_LIST = [
  ...DEFAULT_ENTITY_EXCLUDE_LIST,
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as Array<keyof TypeormBaseEntity | 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
