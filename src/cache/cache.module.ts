import { Module } from '@nestjs/common';
import { CacheService } from '@src/cache/service/cache.service';
import {
  REDIS_DRIVER_TOKEN,
  RedisDriver,
} from '@src/cache/driver/redis.driver';

@Module({
  imports: [],
  providers: [
    {
      provide: REDIS_DRIVER_TOKEN,
      useClass: RedisDriver,
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
