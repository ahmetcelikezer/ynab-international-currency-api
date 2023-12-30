export class RegisterRequestDTO {
  constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
