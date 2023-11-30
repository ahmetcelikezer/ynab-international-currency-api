import { registerAs } from '@nestjs/config';
import { Config } from '@config/config';

export const REDIS_CONFIG_TOKEN = Symbol('config.redis');

export type TRedisConfig = {
  url: string;
};

export default registerAs(REDIS_CONFIG_TOKEN.toString(), (): TRedisConfig => {
  return {
    url: Config.getEnvironmentVariable('REDIS_URL'),
  };
});
