import { Injectable } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { UserProfile } from '../../database/entities';
import { UserProfileStatus } from '../../database/entities/users/types/user-profile-status.enum';
import { UserRepository } from '../../repositories';
import { BaseEntityService } from '@aiofc/service-base';

@Injectable()
export class UserService extends BaseEntityService<
  UserProfile,
  'id',
  UserRepository
> {
  constructor(private readonly usersRepository: UserRepository) {
    super(usersRepository);
  }

  // @Transactional()
  // async updateUserStatus(id: string, status: UserProfileStatus) {
  //   const updateResult = await this.usersRepository.update(id, {
  //     status,
  //   });

  //   return updateResult.affected === 1;
  // }

  @Transactional()
  async findOneByEmail(email: string, tenantId?: string) {
    return this.usersRepository.findOne({
      relations: ['userTenantsAccounts', 'userTenantsAccounts.roles'],
        where: {
          email: email.toLowerCase().trim(),
          userTenantsAccounts: {
            tenantId,
          },
        },
      },
    );
  }
}
