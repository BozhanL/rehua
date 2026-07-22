import { AuthService, TotpPayload } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { JWT_COOKIE_NAME } from './jwt.strategy';
import { LocalAuthGuard } from './local.guard';
import { TOTPAuthGuard } from './totp.guard';
import { User as UserDecorator } from '@/users/users.decorator';
import type { User as UserType } from '@/utils/types';
import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';

export interface AuthLoginBody {
  userId: number;
  password: string;
  totpCode: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard, TOTPAuthGuard)
  @TypedRoute.Post('login')
  login(
    @UserDecorator() user: UserType,
    @Res({ passthrough: true }) response: Response,
    @TypedBody() _body: AuthLoginBody,
  ): UserType | null | undefined {
    const token = this.authService.login(user);
    response.cookie(JWT_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @TypedRoute.Get('totp')
  getTotpSecret(@UserDecorator() user: UserType): TotpPayload | null {
    return this.authService.getTotpSecretUri(user);
  }
}
