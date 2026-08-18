// Generate the TOTP uri on the client side
// TODO: add user type (admin or nurse)
export class TotpResponse {
  constructor(
    public totpSecret: string,
    public totpUri: string,
  ) {}
}
