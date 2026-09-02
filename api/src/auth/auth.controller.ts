import { AuthService, TOKEN_TTL_SEC } from './auth.service';
import type { LoginBody } from './dto/login-body.dto';
import type { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from './jwt.guard';
import { JWT_COOKIE_NAME } from './jwt.strategy';
import { LocalAuthGuard } from './local.guard';
import { TOTPAuthGuard } from './totp.guard';
import { UserService } from '@/schema/users/user.service';
import { CurrentUser } from '@/schema/users/users.decorator';
import type { ExpressUser } from '@/utils/types';
import { TypedBody, TypedRoute } from '@nestia/core';
import { Controller, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { misc } from 'typia';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard, TOTPAuthGuard)
  @TypedRoute.Post('login')
  async login(
    @CurrentUser() expressUser: ExpressUser,
    @Res({ passthrough: true }) response: Response,
    // This is a workaround for the issue where Nestia SDK does not include the body in the generated client.
    // The content will be accessed in the LocalAuthGuard and TOTPAuthGuard
    @TypedBody() _body: LoginBody,
  ): Promise<LoginResponseDto> {
    const token = this.authService.signJwt(expressUser);

    response.cookie(JWT_COOKIE_NAME, token, {
      // Browser may keep session cookies even after the browser is closed, so we need to set an expiration time for the cookie
      // Maybe we can set the expiration time to a few minutes, and refresh the token when the user sends a request to the server.
      maxAge: TOKEN_TTL_SEC * 1000, // 5 min

      // Secure cookie settings
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    const user = await this.userService.findOneUserNameForAuth(
      expressUser.userName,
    );

    if (!user) {
      throw new Error('User not found');
    }

    misc.assertPrune<LoginResponseDto>(user.toJSON());

    return user;
  }

  @UseGuards(JwtAuthGuard)
  @TypedRoute.Post('refresh')
  refresh(
    @CurrentUser() expressUser: ExpressUser,
    @Res({ passthrough: true }) response: Response,
  ): { success: boolean } {
    const token = this.authService.signJwt(expressUser);
    response.cookie(JWT_COOKIE_NAME, token, {
      // Browser may keep session cookies even after the browser is closed, so we need to set an expiration time for the cookie
      // Maybe we can set the expiration time to a few minutes, and refresh the token when the user sends a request to the server.
      maxAge: TOKEN_TTL_SEC * 1000, // 5 min

      // Secure cookie settings
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @TypedRoute.Post('logout')
  logout(@Res({ passthrough: true }) response: Response): { success: boolean } {
    response.cookie(JWT_COOKIE_NAME, '', {
      maxAge: 0,

      // Secure cookie settings
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return { success: true };
  }

  // TODO: remove TotpPayload type and only return the totpSecret
  // Generate the TOTP uri on the client side
  @UseGuards(JwtAuthGuard)
  @TypedRoute.Get('totp')
  async getTotpSecret(
    @CurrentUser() user: ExpressUser,
  ): Promise<string | null> {
    return this.authService.getTotpSecret(user);
  }
}
