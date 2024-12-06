import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserRoleService } from '../../services';
import {
  CreateUserRole,
  ROLES_PAGINATION_CONFIG,
  UpdateUserRole,
  UserRoleWithoutPermission,
} from './vo/role.dto';
import { IdParamUUID, VersionNumberParam } from '@aiofc/common-types';
import { Permissions, Roles } from '@aiofc/auth';
import {
  Paginate,
  Paginated,
  PaginatedSwaggerDocs,
  PaginateQuery,
} from 'nestjs-paginate';
import { map } from '@aiofc/validation';
import { RoleType } from '../../database/entities/roles/types/default-role.enum';

/**
 * 角色管理控制器
 *
 * @description
 * 该控制器处理角色相关的HTTP请求:
 *
 * 1. 装饰器说明
 * - @ApiTags('Roles') - Swagger文档标签
 * - @Controller - 定义路由前缀'roles'和API版本'1'
 * - @ApiBearerAuth - 启用Bearer Token认证
 *
 * 2. 构造函数
 * - 注入UserRoleService用于处理角色业务逻辑
 */
@ApiTags('Roles')
@Controller({
  path: 'roles',
  version: '1',
})
@ApiBearerAuth()
export class RolesController {
  constructor(private readonly userRoleService: UserRoleService) {}

  /**
   * 分页获取所有角色
   *
   * @description
   * GET /roles 端点:
   *
   * 1. 权限控制
   * - 仅管理员和超级管理员可访问
   * - 需要'platform.roles.read'权限
   *
   * 2. 参数说明
   * - @Paginate query - 分页查询参数
   *
   * 3. 返回值
   * - 分页后的角色列表(不含权限信息)
   */
  @Get()
  @Roles<RoleType>([RoleType.ADMIN, RoleType.SUPER_ADMIN])
  @Permissions('platform.roles.read')
  @PaginatedSwaggerDocs(UserRoleWithoutPermission, ROLES_PAGINATION_CONFIG)
  async findAll(
    @Paginate()
    query: PaginateQuery,
  ): Promise<Paginated<UserRoleWithoutPermission>> {
    return this.userRoleService.findAllRolesPaginatedForTenant(
      query,
      ROLES_PAGINATION_CONFIG,
      UserRoleWithoutPermission,
    );
  }

  @Get(':id')
  @Permissions('platform.roles.read')
  async findOne(
    @Param() findOneOptions: IdParamUUID,
  ): Promise<UserRoleWithoutPermission> {
    return this.userRoleService
      .findOneForTenant(findOneOptions.id)
      .then((data) => {
        return map(data, UserRoleWithoutPermission);
      });
  }

  @Post()
  @Permissions('platform.roles.create')
  async create(@Body() customUserRole: CreateUserRole) {
    return this.userRoleService
      .createOrUpdateEntity(customUserRole)
      .then((item) => {
        return map(item, UserRoleWithoutPermission);
      });
  }

  @Put(':id')
  @Permissions('platform.roles.update')
  async updateOne(
    @Param() id: IdParamUUID,
    @Body() role: UpdateUserRole,
  ): Promise<UserRoleWithoutPermission> {
    return this.userRoleService
      .createOrUpdateEntity({
        ...id,
        ...role,
      })
      .then((item) => {
        return this.userRoleService.findOneById(item.id);
      })
      .then((item) => {
        return map(item, UserRoleWithoutPermission);
      });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Permissions('platform.roles.delete')
  async softDelete(
    @Param() path: IdParamUUID,
    @Query() query: VersionNumberParam,
  ) {
    await this.userRoleService.archiveOneForTenant(path.id, query.version);
  }
}
