import { UsersService } from '@/users/users.service';
import type { User } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { generateURI, verify } from 'otplib';

export interface JwtPayload {
  username: string;
  userId: number;
}

export interface TotpPayload {
  totpSecret: string;
  totpUri: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  validateUser(userId: number, pass: string): User | null {
    const user = this.usersService.findOne(userId);
    if (user?.password === pass) {
      const { password: _, ...result } = user;
      return result;
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
      epochTolerance: [30, 0],
    });

    return result.valid;
  }

  login(user: User): string {
    const payload: JwtPayload = {
      username: user.username,
      userId: user.userId,
    };

    return this.jwtService.sign(payload);
  }

  getTotpSecretUri(user: User): TotpPayload | null {
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
