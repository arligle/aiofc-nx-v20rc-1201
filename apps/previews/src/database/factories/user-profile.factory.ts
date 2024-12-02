import { setSeederFactory } from 'typeorm-extension';
import { UserProfile } from '../entities';
import { plainToInstance } from 'class-transformer';
import { UserProfileStatus } from '../entities/users/types/user-profile-status.enum';
import { ExcludeKeys } from '@aiofc/common-types';
import { DEFAULT_CREATE_ENTITY_EXCLUDE_LIST } from '@aiofc/typeorm';

export const userProfileFactory = setSeederFactory(
  UserProfile,
  async (faker) => {
    const plainUserProfile = {
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      status: UserProfileStatus.ACTIVE,
    } satisfies ExcludeKeys<
      UserProfile,
      typeof DEFAULT_CREATE_ENTITY_EXCLUDE_LIST | 'id' | 'version'
    >;

    return plainToInstance(UserProfile, plainUserProfile);
  },
);
