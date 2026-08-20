import type { User } from '@/schema/users/entities/user.entity';

export type LoginResponseDto = Pick<
  User,
  'username' | 'group' | 'firstName' | 'lastName'
>;
