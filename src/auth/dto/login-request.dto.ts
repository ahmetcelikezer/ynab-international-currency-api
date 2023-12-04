export class LoginRequestDTO {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
