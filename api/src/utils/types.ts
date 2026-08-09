import type { UserSchema } from '@/users/users.service';

export type ExpressUser = Omit<UserSchema, 'password' | 'totpSecret'>;

declare module 'express' {
  interface Request {
    user?: ExpressUser | undefined;
  }
}
