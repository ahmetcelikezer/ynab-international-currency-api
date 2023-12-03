import { registerAs } from '@nestjs/config';
import { Config } from '@config/config';

export const AUTH_CONFIG_TOKEN = Symbol('config.auth');

export type TAuthConfig = {
  secretKey: string;
  saltRounds: number;
};

export default registerAs(AUTH_CONFIG_TOKEN.toString(), (): TAuthConfig => {
  return {
    secretKey: Config.getEnvironmentVariable('AUTH_SECRET_KEY'),
    saltRounds: parseInt(
      Config.getEnvironmentVariable('AUTH_PASSWORD_SALT_ROUNDS'),
      10,
    ),
  };
});
