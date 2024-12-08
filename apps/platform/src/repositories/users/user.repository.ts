import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { UserProfile } from '../../database/entities';
import { TrackedTypeormRepository as BaseRepository } from '@aiofc/typeorm';
import { InjectDataSource } from '@aiofc/nestjs-typeorm';

@Injectable()
export class UserRepository extends BaseRepository<UserProfile, 'id'> {
  constructor(
    @InjectDataSource()
    ds: DataSource,
  ) {
    super(UserProfile, ds, 'id');
  }
}
