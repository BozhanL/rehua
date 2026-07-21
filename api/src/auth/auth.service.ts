import { UsersService } from '@/users/users.service';
import type { User } from '@/utils/types';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'otplib';
import typia from 'typia';

export interface JwtPayload {
  username: string;
  userId: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  login(user: User | null | undefined): string {
    typia.assertGuard<User>(user);

    const payload: JwtPayload = {
      username: user.username,
      userId: user.userId,
    };

    return this.jwtService.sign(payload);
  }
}
