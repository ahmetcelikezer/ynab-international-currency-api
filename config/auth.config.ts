import { registerAs } from '@nestjs/config';
import { Config } from '@config/config';

export const AUTH_CONFIG_TOKEN = Symbol('config.auth');

export type TAuthConfig = {
  secretKey: string;
  saltRounds: number;
  jwtIssuer: string;
  jwtAudience: string;
  jwtExpirationTime: string;
};

export default registerAs(AUTH_CONFIG_TOKEN.toString(), (): TAuthConfig => {
  return {
    secretKey: Config.getEnvironmentVariable('AUTH_SECRET_KEY'),
    saltRounds: parseInt(
      Config.getEnvironmentVariable('AUTH_PASSWORD_SALT_ROUNDS'),
      10,
    ),
    jwtIssuer: Config.getEnvironmentVariable('AUTH_JWT_ISSUER'),
    jwtAudience: Config.getEnvironmentVariable('AUTH_JWT_AUDIENCE'),
    jwtExpirationTime: Config.getEnvironmentVariable(
      'AUTH_JWT_EXPIRATION_TIME_SECOND',
    ),
  };
});
