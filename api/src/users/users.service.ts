import { Injectable } from '@nestjs/common';

export interface User {
  userId: number;
  username: string;
  password: string;
  totpSecret: string;
}

@Injectable()
export class UsersService {
  private readonly users: User[] = [
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

  findOne(userId: number): User | null {
    return this.users.find((user) => user.userId === userId) ?? null;
  }
}
