import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IBaseTrackedEntity } from '@aiofc/persistence-base';
import { AbstractBaseEntity } from './abstract-base.entity';

export abstract class AbstractBaseTrackedEntity  extends AbstractBaseEntity implements IBaseTrackedEntity
{
  @ApiProperty({
    type: Date,
    description: 'Created at date time in ISO format',
  })
  @Expose({
    toPlainOnly: true,
  })
  @CreateDateColumn()
  createdAt!: Date; // 创建时间

  @ApiProperty({
    type: Date,
    description: 'Last time updated at date time in ISO format',
  })
  @Expose({
    toPlainOnly: true,
  })
  @UpdateDateColumn()
  updatedAt!: Date; // 更新时间

  @ApiProperty({
    type: Date,
    description: 'Deleted at date time in ISO format',
  })
  @Expose({
    toPlainOnly: true,
  })
  @DeleteDateColumn()
  deletedAt?: Date;  // 删除时间
}
