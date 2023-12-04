import { Body, Controller, Post, Version } from '@nestjs/common';
import { LoginRequestDTO } from '@src/auth/dto/login-request.dto';
import { TAuthLoginToken } from '@src/auth/types/auth-login-token.type';
import { AuthService } from '@src/auth/service/auth.service';
import { RegisterRequestDTO } from '@src/auth/dto/register-request.dto';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Version('1')
  public async login(
    @Body() loginRequestDto: LoginRequestDTO,
  ): Promise<TAuthLoginToken> {
    return this.authService.login(loginRequestDto);
  }

  @Post('register')
  @Version('1')
  public async registerAccount(
    @Body() registerRequestDto: RegisterRequestDTO,
  ): Promise<TAuthLoginToken> {
    return this.authService.registerAccount(registerRequestDto);
  }
}
