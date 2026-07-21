import type { User as UserSchema } from '@/users/users.service';

export type User = Omit<UserSchema, 'password' | 'totpSecret'>;

declare module 'express' {
  interface Request {
    user?: User | null;
  }
}
