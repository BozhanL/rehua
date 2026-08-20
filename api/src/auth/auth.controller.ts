import { AuthService } from './auth.service';
import type { LoginBody } from './dto/login-body.dto';
import * as loginResponseDto from './dto/login-response.dto';
import type { TotpResponse } from './dto/totp-response.dto';
import { JwtAuthGuard } from './jwt.guard';
import { JWT_COOKIE_NAME } from './jwt.strategy';
import { LocalAuthGuard } from './local.guard';
import { TOTPAuthGuard } from './totp.guard';
import * as userEntity from '@/schema/users/entities/user.entity';
import { CurrentUser } from '@/schema/users/users.decorator';
import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard, TOTPAuthGuard)
  @TypedRoute.Post('login')
  login(
    @CurrentUser() user: loginResponseDto.LoginResponseDto,
    @Res({ passthrough: true }) response: Response,
    // This is a workaround for the issue where Nestia SDK does not include the body in the generated client.
    // The content will be accessed in the LocalAuthGuard and TOTPAuthGuard
    @TypedBody() _body: LoginBody,
  ): loginResponseDto.LoginResponseDto {
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

  // TODO: remove TotpPayload type and only return the totpSecret
  // Generate the TOTP uri on the client side
  @UseGuards(JwtAuthGuard)
  @TypedRoute.Get('totp')
  async getTotpSecret(
    @CurrentUser() user: userEntity.UserDocument,
  ): Promise<TotpResponse | null> {
    return this.authService.getTotpSecretUri(user);
  }
}
