// The content of this class will be send to server on every request, and will be used to validate the JWT token.
export class JwtContent {
  constructor(public userId: number) {}
}
