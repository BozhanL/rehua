import { LoginResponseDto } from './dto/login-response.dto';
import type { TotpResponse } from './dto/totp-response.dto';
import { JwtContent } from './entities/jwt-content.entity';
import { UserDocument } from '@/schema/users/entities/user.entity';
import { UserService } from '@/schema/users/user.service';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateURI, verify } from 'otplib';

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
        userId: user._id.toString(),
        username: user.username,
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

  signJwt(user: UserDocument): string {
    const payload: JwtContent = { userId: user._id.toString() };

    return this.jwtService.sign(payload);
  }

  async getTotpSecretUri(user: UserDocument): Promise<TotpResponse | null> {
    const userData = await this.userService.findOne(user._id.toString());
    if (!userData) {
      return null;
    }

    return {
      totpSecret: userData.totpSecret,
      totpUri: generateURI({
        issuer: 'Rehua',
        label: userData.username,
        secret: userData.totpSecret,
      }),
    };
  }
}
