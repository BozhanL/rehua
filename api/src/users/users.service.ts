import { Injectable } from '@nestjs/common';

export interface UserSchema {
  userId: number;
  username: string;
  password: string;
  totpSecret: string;
}

// TODO: replace with a proper database implementation. This is just a mock implementation for testing purposes.
@Injectable()
export class UsersService {
  private readonly users: UserSchema[] = [
    {
      userId: 1,
      username: 'john',
      password: 'password',
      totpSecret: 'QIG6JDKQ5KQTCPNHYP7TAPI56LHZXGED',
    },
    {
      userId: 2,
      username: 'maria',
      password: 'password',
      totpSecret: 'QIG6JDKQ5KQTCPNHYP7TAPI56LHZXGED',
    },
  ];

  findOne(userId: number): UserSchema | null {
    return this.users.find((user) => user.userId === userId) ?? null;
  }
}
