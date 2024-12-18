import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Permission } from '../../database/entities';
import { BaseRepository } from '@aiofc/typeorm';

@Injectable()
export class PermissionRepository extends BaseRepository<Permission, 'id'> {
  constructor(
    @InjectDataSource()
    ds: DataSource,
  ) {
    super(Permission, ds, 'id');
  }
}
