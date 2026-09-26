import { type CustomDecorator, SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

export function Roles(...roles: ('admin' | 'nurse')[]): CustomDecorator {
  return SetMetadata(ROLES_KEY, roles);
}
