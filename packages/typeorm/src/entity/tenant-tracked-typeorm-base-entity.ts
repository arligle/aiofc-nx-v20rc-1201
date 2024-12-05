import { Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ClsPreset } from '../subscribers/decorator/cls-preset.decorator';
import { ITenantTrackedBaseEntity, TenantClsStore } from '@aiofc/persistence-base';
import { TrackedTypeormBaseEntity } from './tracked-typeorm-base-entity';
/**
 * @description 租户实体类，我们可以以此为基础增加更多的属性。
 * 你可以把它作为一个模板，参照这个类的定义方法来定义更多的实体类。
 * @export
 * @class BaseTenantEntity
 */
export abstract class TenantTrackedTypeormBaseEntity
  extends TrackedTypeormBaseEntity implements ITenantTrackedBaseEntity
{
  @ApiProperty({
    description: 'Tenant identifier',
    type: 'string',
  })
  @ClsPreset<TenantClsStore>({
    clsFieldName: 'tenantId',
  })
  @Column({ nullable: false })
  @Index()
  @Expose()
  tenantId!: string; // 租户ID
}


