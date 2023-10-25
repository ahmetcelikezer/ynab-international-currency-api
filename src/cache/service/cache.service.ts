import { Inject, Injectable } from '@nestjs/common';
import { ICacheDriver } from '@src/cache/interface/cache-driver.interface';
import { TCachableItem } from '@src/cache/types/cachable-item.type';
import { REDIS_DRIVER_TOKEN } from '@src/cache/driver/redis.driver';

@Injectable()
export class CacheService {
  constructor(
    @Inject(REDIS_DRIVER_TOKEN) private readonly driver: ICacheDriver,
  ) {}

  public async exists(key: string): Promise<boolean> {
    return this.driver.exists(key);
  }

  public async get<T>(key: string): Promise<T | null> {
    return this.driver.get<T>(key);
  }

  public async set<T extends TCachableItem>(
    key: string,
    value: T,
    ttl?: number,
  ): Promise<void> {
    return this.driver.set<T>(key, value, ttl);
  }

  public async delete(key: string): Promise<void> {
    return this.driver.delete(key);
  }

  public async clear(): Promise<void> {
    return this.driver.clear();
  }
}
