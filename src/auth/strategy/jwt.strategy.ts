import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '@src/auth/service/auth.service';
import { AUTH_CONFIG_TOKEN, TAuthConfig } from '@config/auth.config';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { TJWTPayload } from '@src/auth/payload/jwt.payload';
import { AuthenticatedAccountPayload } from '@src/auth/payload/authenticated-account.payload';

@Injectable()
export class JwtSrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    @Inject(AUTH_CONFIG_TOKEN) readonly authConfig: TAuthConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfig.secretKey,
      ignoreExpiration: false,
      issuer: authConfig.jwtIssuer,
      audience: authConfig.jwtAudience,
    });
  }

  public async validate(
    payload: TJWTPayload,
  ): Promise<AuthenticatedAccountPayload> {
    const account =
      await this.authService.getValidatedAuthenticatedAccount(payload);

    if (!account) {
      throw new UnauthorizedException('Unauthorized');
    }

    return account;
  }
}
