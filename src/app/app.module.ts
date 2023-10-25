import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@config/app.config';
import redisConfig from '@root/config/redis.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [appConfig, redisConfig],
      isGlobal: true,
      cache: true,
    }),
  ],
  providers: [],
})
export class AppModule {}
