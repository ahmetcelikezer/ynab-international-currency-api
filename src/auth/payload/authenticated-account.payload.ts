export class AuthenticatedAccountPayload {
  constructor(
    public readonly id: string,
    public readonly email: string,
  ) {}
}
