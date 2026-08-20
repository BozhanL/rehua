import type { User } from '@/schema/users/entities/user.entity';

export type ExpressUser = Pick<User, 'username' | 'group'>;

declare module 'express' {
  interface Request {
    user?: ExpressUser | undefined;
  }
}
