import { AccessTokenPayload } from './token-payload';
import { UserClsStore } from '@aiofc/auth';

export interface ClsStore extends UserClsStore<AccessTokenPayload> {}
