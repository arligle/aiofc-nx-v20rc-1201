import { OmitType } from '@nestjs/swagger';
import { UserRole } from '../../../database/entities';
import { FilterOperator, PaginateConfig } from 'nestjs-paginate';
import {
  DEFAULT_CREATE_ENTITY_EXCLUDE_LIST,
  DEFAULT_ENTITY_EXCLUDE_LIST,
  DEFAULT_UPDATE_ENTITY_EXCLUDE_LIST,
} from '@aiofc/typeorm';

/**
 * 不包含权限的用户角色DTO类
 * 通过OmitType从UserRole实体中排除指定字段
 * 排除了默认实体排除列表中的字段、permissions和tenant字段
 */
export class UserRoleWithoutPermission extends OmitType(UserRole, [
  ...DEFAULT_ENTITY_EXCLUDE_LIST,
  'permissions',
  'tenant',
] as const) {}

/**
 * 创建用户角色DTO类
 * 通过OmitType从UserRole实体中排除指定字段
 * 排除了默认创建实体排除列表中的字段,以及roleType、tenant、permissions等字段
 */
export class CreateUserRole extends OmitType(UserRole, [
  ...DEFAULT_CREATE_ENTITY_EXCLUDE_LIST,
  'roleType',
  'tenant',
  'permissions',
  'tenantId',
  'id',
  'version',
] as const) {}

/**
 * 更新用户角色DTO类
 * 通过OmitType从UserRole实体中排除指定字段
 * 排除了默认更新实体排除列表中的字段,以及roleType、permissions和tenantId字段
 */
export class UpdateUserRole extends OmitType(UserRole, [
  ...DEFAULT_UPDATE_ENTITY_EXCLUDE_LIST,
  'roleType',
  'permissions',
  'tenantId',
] as const) {}

/**
 * 用户角色分页配置
 * @property defaultLimit - 默认每页显示50条记录
 * @property maxLimit - 每页最多显示100条记录
 * @property searchableColumns - 可搜索的字段包括name和roleType
 * @property filterableColumns - 可过滤的字段配置:
 *   - id: 支持相等和包含操作
 *   - name: 支持包含操作
 * @property sortableColumns - 可排序的字段包括id、name、createdAt和updatedAt
 * @property defaultSortBy - 默认按createdAt和id降序排序
 */
export const ROLES_PAGINATION_CONFIG: PaginateConfig<UserRole> = {
  defaultLimit: 50,
  maxLimit: 100,
  searchableColumns: ['name', 'roleType'],
  filterableColumns: {
    id: [FilterOperator.EQ, FilterOperator.IN],
    name: [FilterOperator.CONTAINS],
  },
  sortableColumns: ['id', 'name', 'createdAt', 'updatedAt'],
  defaultSortBy: [
    ['createdAt', 'DESC'],
    ['id', 'DESC'],
  ],
};
