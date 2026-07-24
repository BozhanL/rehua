// TODO: remove TotpPayload type and only return the totpSecret
// Generate the TOTP uri on the client side
export class TotpResponse {
  constructor(
    public totpSecret: string,
    public totpUri: string,
  ) {}
}
