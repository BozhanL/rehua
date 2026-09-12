import type { UserSchema } from '@/users/users.service';
import type { tags } from 'typia';

export type MongoId = string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;

export type ExpressUser = Omit<UserSchema, 'password' | 'totpSecret'>;

declare module 'express' {
  interface Request {
    user?: ExpressUser | undefined;
  }
}
