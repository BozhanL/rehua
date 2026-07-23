import { AuthLoginBody } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@/utils/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-local';

@Injectable()
export class TOTPStrategy extends PassportStrategy(Strategy, 'totp') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userId' satisfies keyof AuthLoginBody,
      passwordField: 'totpCode' satisfies keyof AuthLoginBody,
      passReqToCallback: true,
      session: false,
    });
  }

  async validate(
    req: Request,
    userId: number,
    totpCode: string,
  ): Promise<User | null | undefined> {
    const isValid = await this.authService.validateTotp(userId, totpCode);

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return req.user;
  }
}
