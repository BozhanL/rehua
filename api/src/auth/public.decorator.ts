import { type CustomDecorator, SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

export function Public(): CustomDecorator {
  return SetMetadata(IS_PUBLIC_KEY, true);
}
