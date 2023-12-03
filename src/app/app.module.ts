import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@config/app.config';
import redisConfig from '@config/redis.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import authConfig from '@config/auth.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [appConfig, redisConfig, authConfig],
      isGlobal: true,
      cache: true,
    }),
    MikroOrmModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
