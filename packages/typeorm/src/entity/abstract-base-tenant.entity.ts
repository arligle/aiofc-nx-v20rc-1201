import { Column, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AbstractBaseTrackedEntity } from './abstract-base-tracked.entity';
import { ClsPreset } from '../subscribers/decorator/cls-preset.decorator';
import { IBaseTenantedTrackedEntity, TenantClsStore } from '@aiofc/persistence-base';
/**
 * @description 租户实体类，我们可以以此为基础增加更多的属性。
 * 你可以把它作为一个模板，参照这个类的定义方法来定义更多的实体类。
 * @export
 * @class BaseTenantEntity
 */
export abstract class AbstractBaseTenantEntity
  extends AbstractBaseTrackedEntity implements IBaseTenantedTrackedEntity
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


