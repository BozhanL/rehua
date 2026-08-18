import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWT_SECRET, JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { TOTPStrategy } from './totp.strategy';
import { UserModule } from '@/schema/users/user.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { SignOptions } from 'jsonwebtoken';

const JWT_SIGN_OPTIONS: SignOptions = { expiresIn: '1h' };

@Module({
  controllers: [AuthController],
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: JWT_SIGN_OPTIONS,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, TOTPStrategy],
})
export class AuthModule {}
