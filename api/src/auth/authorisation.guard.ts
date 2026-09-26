import { IS_PUBLIC_KEY } from './public.decorator';
import { ROLES_KEY } from './roles.decorator';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorisationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<true | undefined>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) {
      return true;
    }

    // It will return first defined value, and ignore the rest.
    // It will first read from method, then class
    const roles = this.reflector.getAllAndOverride<
      ('admin' | 'nurse')[] | undefined
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    // By default, it will reject if roles is not defined
    if (!roles || roles.length <= 0) {
      return false;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;
    if (!user) {
      return false;
    }

    return roles.includes(user.group);
  }
}
