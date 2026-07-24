import type { JwtContent } from './entities/jwt-content.entity';
import { UsersService } from '@/users/users.service';
import type { ExpressUser } from '@/utils/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import typia, { misc } from 'typia';

export const JWT_COOKIE_NAME = 'token';
export const JWT_STRATEGY_NAME = 'jwt';

// TODO: read from environment variable and file. See MONGODB_URI_FILE for details
export const JWT_SECRET =
  'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.';

function cookieExtractor(req: Request): string | null {
  const token: unknown = req.cookies[JWT_COOKIE_NAME];
  if (typia.is<string>(token)) {
    return token;
  }
  return null;
}

// This strategy is used to authenticate users using their JWT token.
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, JWT_STRATEGY_NAME) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  validate(payload: JwtContent): ExpressUser {
    typia.assertGuard<typeof payload>(payload);

    // May have performance issues
    const user = this.usersService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return misc.assertPrune<ExpressUser>(misc.clone(user));
  }
}
