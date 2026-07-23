import { AuthLoginBody } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '@/utils/types';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'userId' satisfies keyof AuthLoginBody,
      passwordField: 'password' satisfies keyof AuthLoginBody,
      passReqToCallback: false,
      session: false,
    });
  }

  validate(userId: number, password: string): User {
    const user = this.authService.validateUser(userId, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
