import { User } from '@/schema/users/entities/user.entity';
import { PickType } from '@nestjs/swagger';

export class LoginResponseDto extends PickType(User, [
  'userName',
  'group',
  'firstName',
  'lastName',
]) {}
