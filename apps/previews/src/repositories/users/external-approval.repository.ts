import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ExternalApproval } from '../../database/entities';
import { BaseRepository } from '@aiofc/typeorm';

@Injectable()
export class ExternalApprovalsRepository extends BaseRepository<
  ExternalApproval,
  'id'
> {
  constructor(
    @InjectDataSource()
    ds: DataSource,
  ) {
    super(ExternalApproval, ds, 'id');
  }
}
