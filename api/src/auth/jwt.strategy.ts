import { jwtConstants } from './auth.module';
import { JwtPayload } from './auth.service';
import { User } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import typia from 'typia';

export const JWT_COOKIE_NAME = 'jwt';

function cookieExtractor(req: Request): string | null {
  const token: unknown = req.cookies[JWT_COOKIE_NAME];
  if (typia.is<string>(token)) {
    return token;
  }
  return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  validate(payload: JwtPayload): User {
    return { userId: payload.userId, username: payload.username };
  }
}
