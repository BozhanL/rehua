import type { User } from '@/schema/users/entities/user.entity';
import type { tags } from 'typia';

export type MongoId = string & tags.Pattern<'^[0-9a-fA-F]{24}$'>;

export type ExpressUser = Pick<User, 'userName' | 'group'>;

declare module 'express' {
  interface Request {
    user?: ExpressUser | undefined;
  }
}
