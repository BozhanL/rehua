import { TOTP_STRATEGY_NAME } from './totp.strategy';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TOTPAuthGuard extends AuthGuard(TOTP_STRATEGY_NAME) {}
