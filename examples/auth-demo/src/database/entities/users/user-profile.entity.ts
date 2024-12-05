import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  VersionColumn,
} from 'typeorm';

import { UserProfileStatus } from './types/user-profile-status.enum';
import { UserTenantAccount } from './user-tenant-account.entity';
import {
  IsEmailLocalized,
  IsNumberLocalized,
  IsStringCombinedLocalized,
  IsStringEnumLocalized,
  IsUUIDLocalized,
  PasswordLocalized,
} from '@aiofc/validation';
import { Expose } from 'class-transformer';
import { TrackedTypeormBaseEntity } from '@aiofc/typeorm';

@Entity('user_profile')
export class UserProfile extends TrackedTypeormBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  @IsUUIDLocalized()
  id!: string;

  @Column({ type: String, unique: true, nullable: false, length: 320 })
  @Index({ unique: true })
  @Expose()
  @IsEmailLocalized()
  email!: string;

  // having it nullable is useful for set password later logic
  // and for sign in using social networks/sso
  @Column({ nullable: true, length: 256 })
  @Expose()
  @PasswordLocalized()
  password?: string;

  @Column({ type: String, nullable: false, length: 256 })
  @Expose()
  @IsStringCombinedLocalized({ minLength: 1, maxLength: 256 })
  firstName!: string;

  @Column({ type: String, nullable: false, length: 256 })
  @Expose()
  @IsStringCombinedLocalized({ minLength: 1, maxLength: 256 })
  lastName!: string;

  @Column({
    type: 'enum',
    enum: UserProfileStatus,
  })
  @Expose()
  @IsStringEnumLocalized(UserProfileStatus)
  status!: UserProfileStatus;

  @OneToMany(() => UserTenantAccount, (tenantUser) => tenantUser.userProfile, {
    eager: false,
  })
  userTenantsAccounts?: UserTenantAccount[];

  @VersionColumn()
  @IsNumberLocalized()
  @Expose()
  version!: number;
}
