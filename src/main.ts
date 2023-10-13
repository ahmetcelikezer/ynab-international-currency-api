import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { APP_CONFIG_KEY, IAppConfig } from '@root/config/app.config';
import { AppModule } from '@src/app/app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>(APP_CONFIG_KEY);

  if (!appConfig) {
    throw new Error('App config not found');
  }

  await app.listen(appConfig.port);
  Logger.log(
    `Server(v${appConfig.version.version}) is running on port ${appConfig.port} 🚀 (Environment: ${appConfig.environment}, Debug Mode: ${appConfig.debug})`,
    'Application',
  );

  if (appConfig.debug) {
    Logger.log('Debug mode is enabled', 'Application');
  }
}

bootstrap().catch((err) => Logger.error(err, 'Application'));
