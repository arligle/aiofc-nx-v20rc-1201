import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserTenantAccount } from '../../database/entities';
import {
  TenantTrackedTypeormRepository as BaseRepository,
} from '@aiofc/typeorm';
import { ClsService } from '@aiofc/nestjs-cls';
import { InjectDataSource } from '@aiofc/nestjs-typeorm';
import { TenantClsStore } from '@aiofc/persistence-base';

/**
 * 用户租户账号仓储类
 * 用于处理用户租户账号相关的数据库操作
 * 继承自BaseRepository基础仓储类
 */
@Injectable()
export class UserTenantAccountRepository extends BaseRepository<
  UserTenantAccount,
  'id'
> {
  /**
   * 构造函数
   * @param ds - 数据源注入
   * @param clsService - CLS服务,用于处理租户上下文
   */
  constructor(
    @InjectDataSource()
    ds: DataSource,
    clsService: ClsService<TenantClsStore>,
  ) {
    super(UserTenantAccount, ds, 'id', clsService);
  }

  /**
   * 检查用户是否拥有任一指定权限
   * @param tenantId - 租户ID
   * @param userProfileId - 用户档案ID
   * @param permissions - 权限列表
   * @returns Promise<boolean> - 如果用户拥有任一权限返回true
   */
  public async hasAnyPermission(
    tenantId: string,
    userProfileId: string,
    permissions: string[],
  ): Promise<boolean> {
    return (
      this.getBaseUserTenantAccountSelectQueryBuilder(tenantId, userProfileId)
        .andWhere('LOWER(permission.action) IN (:...permissions)', {
          permissions,
        })
        .limit(1)
        // .cache(15 * 1000)
        .getCount()
        .then((count) => count > 0)
    );
  }

  /**
   * 检查用户是否拥有所有指定权限
   * @param tenantId - 租户ID
   * @param userProfileId - 用户档案ID
   * @param permissions - 权限列表
   * @returns Promise<boolean> - 如果用户拥有所有权限返回true
   */
  public hasEachPermission(
    tenantId: string,
    userProfileId: string,
    permissions: string[],
  ): Promise<boolean> {
    let queryBuilder = this.getBaseUserTenantAccountSelectQueryBuilder(
      tenantId,
      userProfileId,
    );

    for (const permission of permissions) {
      queryBuilder = queryBuilder.andWhere(
        'LOWER(permission.action) = :permission',
        {
          permission,
        },
      );
    }
    return (
      queryBuilder
        .limit(1)
        // .cache(15 * 1000)
        .getCount()
        .then((count) => count > 0)
    );
  }

  /**
   * 获取基础的用户租户账号查询构建器
   * 包含了用户-角色-权限的关联查询
   * @param tenantId - 租户ID
   * @param userProfileId - 用户档案ID
   * @returns QueryBuilder - 查询构建器实例
   */
  private getBaseUserTenantAccountSelectQueryBuilder(
    tenantId: string,
    userProfileId: string,
  ) {
    return this.createQueryBuilder('user')
      .innerJoin('user.roles', 'role')
      .innerJoin('role.permissions', 'permission')
      .where('user.userProfileId = :userProfileId', { userProfileId })
      .andWhere('user.tenantId = :tenantId', { tenantId });
  }
}
