import { AuthService } from './auth.service';
import type { LoginBody } from './dto/login-body.dto';
import type { ExpressUser } from '@/utils/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-local';
import typia from 'typia';

export const TOTP_STRATEGY_NAME = 'totp';

@Injectable()
export class TOTPStrategy extends PassportStrategy(
  Strategy,
  TOTP_STRATEGY_NAME,
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userId' satisfies keyof LoginBody,
      passwordField: 'totpCode' satisfies keyof LoginBody,
      passReqToCallback: true,
      session: false,
    });
  }

  async validate(
    req: Request,
    userId: number,
    totpCode: string,
  ): Promise<ExpressUser | undefined> {
    typia.assertGuard<typeof userId>(userId);
    typia.assertGuard<typeof totpCode>(totpCode);

    const isValid = await this.authService.validateTotp(userId, totpCode);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return req.user;
  }
}
