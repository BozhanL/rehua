import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWT_SECRET, JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { TOTPStrategy } from './totp.strategy';
import { UsersModule } from '@/users/users.module';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import type { SignOptions } from 'jsonwebtoken';

const JWT_SIGN_OPTIONS: SignOptions = { expiresIn: '1h' };

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    // @nestjs/passport v12 guards inject an `AuthModuleOptions` provider that is
    // only registered by `PassportModule.register()`/`registerAsync()`. A bare
    // `PassportModule` import no longer provides it, so the guards must be used
    // with a registered module. All strategies are stateless (cookie/JWT based),
    // so disable sessions to match the original behavior.
    PassportModule.register({ session: false }),
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: JWT_SIGN_OPTIONS,
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, TOTPStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
