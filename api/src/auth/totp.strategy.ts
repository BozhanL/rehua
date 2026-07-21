import { AuthLoginBody } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@/utils/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { Strategy } from 'passport-custom';
import typia from 'typia';

@Injectable()
export class TOTPStrategy extends PassportStrategy(Strategy, 'totp') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(req: Request): Promise<User | null | undefined> {
    const body = typia.assert<AuthLoginBody>(req.body);

    const isValid = await this.authService.validateTotp(
      body.userId,
      body.totpCode,
    );

    if (!isValid) {
      throw new UnauthorizedException();
    }

    return req.user;
  }
}
