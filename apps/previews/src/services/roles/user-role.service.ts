import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { UserRole } from '../../database/entities';
import { RoleType } from '../../database/entities/roles/types/default-role.enum';
import { IsNull } from 'typeorm';
import { ClsStore } from '../../common/vo/cls-store';
import { PaginateConfig, Paginated, PaginateQuery } from 'nestjs-paginate';
import { ClassConstructor } from 'class-transformer';
import { ClsService } from '@aiofc/nestjs-cls';
import { BaseEntityService } from '@aiofc/service-base';
import { UserRoleRepository } from '../../repositories/roles/user-role.repository';

@Injectable()
export class UserRoleService extends BaseEntityService<
  UserRole,
  'id',
  UserRoleRepository
> {
  constructor(
    repository: UserRoleRepository,
    private readonly clsService: ClsService<ClsStore>,
  ) {
    super(repository);
  }

  // public async archiveOneForTenant(
  //   id: string,
  //   version: number,
  // ): Promise<boolean> {
  //   return this.repository
  //     .update(
  //       {
  //         id,
  //         version,
  //         deletedAt: IsNull(),
  //         tenantId: this.clsService.get().tenantId,
  //       },
  //       {
  //         deletedAt: new Date(),
  //       },
  //     )
  //     .then((result) => result.affected === 1);
  // }

  // public async findOneForTenant(id: string) {
  //   return this.findOne({
  //     where: [
  //       {
  //         id,
  //         tenantId: this.clsService.get().tenantId,
  //       },
  //     ],
  //   });
  // }

  async findAllRolesPaginatedForTenant<T>(
    query: PaginateQuery,
    config: PaginateConfig<UserRole>,
    clazz: ClassConstructor<T>,
  ): Promise<Paginated<T>> {
    return this.findAllPaginatedAndTransform(
      query,
      {
        ...config,
        where: [
          {
            tenantId: this.clsService.get().tenantId,
          },
          {
            tenantId: IsNull(),
          },
        ],
      },
      clazz,
    );
  }

  @Transactional()
  async findDefaultUserRole() {
    // return this.findDefaultRoleByType(RoleType.REGULAR_USER);
    // TODO: 旧版本的findDefaultRoleByType方法已经被删除
    const userRole = Object.create(UserRole.prototype);
    return userRole;
  }

  // @Transactional()
  // async findDefaultAdminRole() {
  //   return this.findDefaultRoleByType(RoleType.ADMIN);
  // }

  // private findDefaultRoleByType(roleType: RoleType) {
  //   return this.repository.findOne({
  //     where: [
  //       {
  //         roleType,
  //         tenantId: IsNull(),
  //       },
  //     ],
  //     cache: true,
  //   });
  // }
}
