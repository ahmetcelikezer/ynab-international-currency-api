import { registerAs } from '@nestjs/config';
import { Config } from '@config/config';

export const AUTH_CONFIG_TOKEN = Symbol('config.auth');

export type TAuthConfig = {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  saltRounds: number;
  jwtIssuer: string;
  jwtAudience: string;
  accessTokenExpirationTime: number;
  refreshTokenExpirationTime: number;
};

export default registerAs(AUTH_CONFIG_TOKEN.toString(), (): TAuthConfig => {
  return {
    accessTokenSecret: Config.getEnvironmentVariable('AUTH_JWT_SECRET_KEY'),
    saltRounds: parseInt(
      Config.getEnvironmentVariable('AUTH_PASSWORD_SALT_ROUNDS'),
      10,
    ),
    jwtIssuer: Config.getEnvironmentVariable('AUTH_JWT_ISSUER'),
    jwtAudience: Config.getEnvironmentVariable('AUTH_JWT_AUDIENCE'),
    accessTokenExpirationTime: parseInt(
      Config.getEnvironmentVariable('AUTH_JWT_EXPIRATION_TIME_SECOND'),
      10,
    ),
    refreshTokenExpirationTime: parseInt(
      Config.getEnvironmentVariable('AUTH_JWT_REFRESH_EXPIRATION_TIME_SECOND'),
      10,
    ),
    refreshTokenSecret: Config.getEnvironmentVariable(
      'AUTH_JWT_REFRESH_SECRET_KEY',
    ),
  };
});
