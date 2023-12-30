import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  Version,
} from '@nestjs/common';
import { LoginRequestDTO } from '@src/auth/dto/login-request.dto';
import { TAuthLoginToken } from '@src/auth/types/auth-login-token.type';
import { AuthService } from '@src/auth/service/auth.service';
import { RegisterRequestDTO } from '@src/auth/dto/register-request.dto';
import { Request, Response } from 'express';
import { ECookie } from '@src/auth/enum/cookie.enum';
import { AuthenticatedAccountGuard } from '@src/auth/guard/authenticated-account.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Version('1')
  @ApiOperation({
    summary: 'Login with account',
    description:
      'Login with an email and password. Returns an access token and sets a refresh token in a cookie http-only and safe.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'When the account is successfully logged in.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'When the request body is invalid.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'When the credentials are invalid.',
  })
  @ApiBody({ type: LoginRequestDTO })
  public async login(
    @Body() loginRequestDto: LoginRequestDTO,
    @Res() response: Response,
  ): Promise<void> {
    const tokenPair = await this.authService.login(loginRequestDto);

    response.cookie(ECookie.REFRESH_TOKEN, tokenPair.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: tokenPair.refresh_token_expires_in_ms,
    });

    response
      .status(HttpStatus.OK)
      .json({ access_token: tokenPair.access_token });
  }

  @Post('register')
  @Version('1')
  @ApiOperation({
    summary: 'Register an account',
    description:
      'Register an account with an email and password. Returns an access token and sets a refresh token in a cookie http-only and safe.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'When the account is successfully registered.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'When the request body is invalid.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'When the email is already in use.',
  })
  @ApiBody({ type: RegisterRequestDTO })
  public async registerAccount(
    @Body() registerRequestDto: RegisterRequestDTO,
    @Res() response: Response,
  ): Promise<void> {
    const tokenPair =
      await this.authService.registerAccount(registerRequestDto);

    response.cookie(ECookie.REFRESH_TOKEN, tokenPair.refresh_token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: tokenPair.refresh_token_expires_in_ms,
    });

    response
      .status(HttpStatus.CREATED)
      .json({ access_token: tokenPair.access_token });
  }

  @Post('refresh')
  @UseGuards(AuthenticatedAccountGuard)
  @Version('1')
  @ApiOperation({
    summary: 'Refresh the access token.',
    description:
      'Requires a valid refresh token. The refresh token is sent in a cookie http-only and safe.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Access token refreshed successfully.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid or expired refresh token.',
  })
  public async refreshAccessToken(
    @Req() request: Request,
  ): Promise<TAuthLoginToken> {
    if (!request.cookies.hasOwnProperty(ECookie.REFRESH_TOKEN)) {
      throw new UnauthorizedException(
        'Failed to refresh access token, no refresh token found',
      );
    }

    const refreshToken: string = request.cookies[ECookie.REFRESH_TOKEN];
    const accessToken = await this.authService.refreshAccessToken(refreshToken);

    return { access_token: accessToken };
  }
}
