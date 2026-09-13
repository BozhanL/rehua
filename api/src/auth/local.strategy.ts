import { AuthService } from './auth.service';
import type { LoginBody } from './dto/login-body.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import typia from 'typia';

export const LOCAL_STRATEGY_NAME = 'local';

// This strategy is used to authenticate users using their userName and password.
// It validates the userName and password against the database and returns the ExpressUser from database if valid.
// TOTP checking is done in the TOTPStrategy, so we don't need to check the TOTP code here.
@Injectable()
export class LocalStrategy extends PassportStrategy(
  Strategy,
  LOCAL_STRATEGY_NAME,
) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userName' satisfies keyof LoginBody,
      passwordField: 'password' satisfies keyof LoginBody,
      passReqToCallback: false,
      session: false,
    });
  }

  async validate(
    userName: string,
    password: string,
  ): Promise<LoginResponseDto> {
    typia.assertGuard<typeof userName>(userName);
    typia.assertGuard<typeof password>(password);

    const user = await this.authService.validateUser(userName, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
