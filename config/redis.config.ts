import { registerAs } from '@nestjs/config';
import { MissingEnvironmentVariableError } from '@config/error/missing-environment-variable.error';
import { Config } from '@config/config';

export const REDIS_CONFIG_TOKEN = Symbol('config.redis');

export type TRedisConfig = {
  url: string;
};

export default registerAs(REDIS_CONFIG_TOKEN.toString(), (): TRedisConfig => {
  const url: string | undefined = Config.getEnvironmentVariable('REDIS_URL');

  if (!url) {
    throw new MissingEnvironmentVariableError('REDIS_URL');
  }

  return {
    url,
  };
});
