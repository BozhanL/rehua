import type { User } from '@/schema/users/entities/user.entity';

export type LoginResponseDto = Pick<
  User,
  'userName' | 'group' | 'firstName' | 'lastName'
>;
