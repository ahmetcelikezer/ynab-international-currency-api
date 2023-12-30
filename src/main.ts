import { Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { APP_CONFIG_TOKEN, IAppConfig } from '@root/config/app.config';
import { AppModule } from '@src/app/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>(APP_CONFIG_TOKEN.toString());

  if (!appConfig) {
    throw new Error('App config not found');
  }

  app.use(cookieParser());

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
