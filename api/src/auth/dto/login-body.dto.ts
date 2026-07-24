export class LoginBody {
  constructor(
    public userId: number,
    public password: string,
    public totpCode: string,
  ) {}
}
