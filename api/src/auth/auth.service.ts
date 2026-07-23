import type { TotpResponse } from './dto/totp-response.dto';
import { JwtContent } from './entities/jwt-content.entity';
import { UsersService } from '@/users/users.service';
import type { ExpressUser } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateURI, verify } from 'otplib';
import { misc } from 'typia';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  validateUser(userId: number, pass: string): ExpressUser | null {
    const user = this.usersService.findOne(userId);

    if (user?.password === pass) {
      return misc.assertPrune<ExpressUser>(misc.clone(user));
    }
    return null;
  }

  async validateTotp(userId: number, totpCode: string): Promise<boolean> {
    const user = this.usersService.findOne(userId);
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
    const payload: JwtContent = { userId: user.userId };

    return this.jwtService.sign(payload);
  }

  getTotpSecretUri(user: ExpressUser): TotpResponse | null {
    const userData = this.usersService.findOne(user.userId);
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
