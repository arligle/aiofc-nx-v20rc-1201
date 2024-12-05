import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserRole } from '../../database/entities';
import { BaseTypeormTrackedEntityRepository as BaseRepository } from '@aiofc/typeorm';
import { InjectDataSource } from '@aiofc/nestjs-typeorm';

@Injectable()
export class UserRoleRepository extends BaseRepository<UserRole, 'id'> {
  constructor(
    @InjectDataSource()
    ds: DataSource,
  ) {
    super(UserRole, ds, 'id');
  }
}
