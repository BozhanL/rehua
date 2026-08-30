import { LoginResponseDto } from './dto/login-response.dto';
import { UserService } from '@/schema/users/user.service';
import { ExpressUser } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'otplib';

// 5 min for the token to be valid
// if you update TOKEN_TTL_SEC update the client side too
export const TOKEN_TTL_SEC = 5 * 60;

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(
    userName: string,
    password: string,
  ): Promise<LoginResponseDto | null> {
    const user = await this.userService.findOneUserNameForAuth(userName);

    if (user?.password === password) {
      return {
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        group: user.group,
      };
    }
    return null;
  }

  async validateTotp(userName: string, totpCode: string): Promise<boolean> {
    const user = await this.userService.findOneUserNameForAuth(userName);
    if (!user) {
      return false;
    }

    const result = await verify({
      token: totpCode,
      secret: user.totpSecret,

      // Accept tokens that are at max 30 seconds old.
      // Reject tokens that are older than 30 seconds, or newer than the current time.
      epochTolerance: [30, 0],
    });

    return result.valid;
  }

  signJwt(user: ExpressUser): string {
    return this.jwtService.sign(user, { expiresIn: TOKEN_TTL_SEC });
  }

  async getTotpSecret(user: ExpressUser): Promise<string | null> {
    const userData = await this.userService.findOneUserNameForAuth(
      user.userName,
    );
    if (!userData) {
      return null;
    }

    return userData.totpSecret;
  }
}
