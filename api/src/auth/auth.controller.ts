import { AuthService } from './auth.service';
import type { LoginBody } from './dto/login-body.dto';
import type { TotpResponse } from './dto/totp-response.dto';
import { JwtAuthGuard } from './jwt.guard';
import { JWT_COOKIE_NAME } from './jwt.strategy';
import { LocalAuthGuard } from './local.guard';
import { TOTPAuthGuard } from './totp.guard';
import { User } from '@/users/users.decorator';
import type { ExpressUser } from '@/utils/types';
import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard, TOTPAuthGuard)
  @TypedRoute.Post('login')
  login(
    @User() user: ExpressUser,
    @Res({ passthrough: true }) response: Response,

    // This is a workaround for the issue where Nestia SDK does not include the body in the generated client.
    // The content will be accessed in the LocalAuthGuard and TOTPAuthGuard
    @TypedBody() _body: LoginBody,
  ): ExpressUser {
    const token = this.authService.signJwt(user);

    response.cookie(JWT_COOKIE_NAME, token, {
      // TODO: replace with a proper expiration time
      // Browser may keep session cookies even after the browser is closed, so we need to set an expiration time for the cookie
      // Maybe we can set the expiration time to a few minutes, and refresh the token when the user sends a request to the server.
      expires: undefined,

      // Secure cookie settings
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @TypedRoute.Get('totp')
  getTotpSecret(
    @User() user: ExpressUser,
  ): // TODO: remove TotpPayload type and only return the totpSecret
  // Generate the TOTP uri on the client side
  TotpResponse | null {
    return this.authService.getTotpSecretUri(user);
  }
}
