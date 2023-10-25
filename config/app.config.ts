import { registerAs } from '@nestjs/config';
import { Config } from '@config/config';
import packageJSON from '@root/package.json';

export const APP_CONFIG_TOKEN = Symbol('config.app');

export enum EEnvironment {
  LOCAL = 'local',
  DEVELOPMENT = 'development',
  TEST = 'test',
  PRODUCTION = 'production',
}

export interface IAppConfig {
  port: number;
  version: AppVersion;
  environment: EEnvironment;
  debug: boolean;
}

export class AppVersion {
  public readonly major: number;
  public readonly minor: number;
  public readonly patch: number;

  constructor(public readonly version: string) {
    if (!version) {
      throw new Error('Version must be defined');
    }

    const [major, minor, patch] = version
      .split('.')
      .map((v) => parseInt(v, 10));

    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }
}

const getAppEnvironment = (): EEnvironment => {
  const environment = Config.getEnvironmentVariableWithFallback(
    'NODE_ENV',
    EEnvironment.LOCAL as string,
  );

  if (Object.values(EEnvironment).includes(environment as EEnvironment)) {
    return environment as EEnvironment;
  }

  throw new Error(
    `Environment variable NODE_ENV is not valid. Valid values are ${Object.values(
      EEnvironment,
    ).join(', ')}, but got ${environment}!`,
  );
};

export default registerAs(APP_CONFIG_TOKEN.toString(), (): IAppConfig => {
  const isDebugEnabled = Boolean(
    Config.getEnvironmentVariableWithFallback('DEBUG', 'false'),
  );
  const appEnvironment = getAppEnvironment();

  if (isDebugEnabled && appEnvironment === EEnvironment.PRODUCTION) {
    throw new Error(
      'Debug mode is not allowed in production environment! Please set DEBUG=false or NODE_ENV to something else than production!',
    );
  }

  return {
    port: parseInt(
      Config.getEnvironmentVariableWithFallback('PORT', '3000'),
      10,
    ),
    version: new AppVersion(packageJSON.version),
    environment: appEnvironment,
    debug: isDebugEnabled,
  };
});
