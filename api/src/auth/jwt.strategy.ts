import { LoginResponseDto } from './dto/login-response.dto';
import { JwtContent } from './entities/jwt-content.entity';
import { UserService } from '@/schema/users/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-jwt';
import typia from 'typia';

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
  constructor(private readonly usersService: UserService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: JwtContent): Promise<LoginResponseDto> {
    typia.assertGuard<typeof payload>(payload);

    // May have performance issues
    const user = await this.usersService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      group: user.group,
    };
  }
}
