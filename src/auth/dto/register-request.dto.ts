import { ApiProperty } from '@nestjs/swagger';
export class RegisterRequestDTO {
  @ApiProperty({
    description: 'The email of the account.',
    example: 'user@example.com',
  })
  public readonly email: string;

  @ApiProperty({
    description: 'The password of the account.',
    example: 'password123',
  })
  public readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
