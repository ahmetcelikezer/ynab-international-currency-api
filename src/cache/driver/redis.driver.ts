import {
  Injectable,
  Logger,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { REDIS_CONFIG_TOKEN, TRedisConfig } from '@root/config/redis.config';
import { ICacheDriver } from '@src/cache/interface/cache-driver.interface';
import { RedisClientType, createClient } from 'redis';
import { TCachableItem } from '@src/cache/types/cachable-item.type';
import { ConfigService } from '@nestjs/config';

export const REDIS_DRIVER_TOKEN = Symbol('driver.redis');

const CACHE_DRIVER_NAME = 'RedisCacheDriver';

@Injectable()
export class RedisDriver
  implements ICacheDriver, OnModuleInit, OnApplicationShutdown
{
  private readonly client: RedisClientType;
  private readonly redisConfig: TRedisConfig;

  constructor(configService: ConfigService) {
    const redisConfig: TRedisConfig | undefined =
      configService.get<TRedisConfig>(REDIS_CONFIG_TOKEN.toString());
    if (!redisConfig) {
      throw new Error('Redis config not found');
    }
    this.redisConfig = redisConfig;

    this.client = createClient({
      url: this.redisConfig.url,
    });
  }

  public onModuleInit(): void {
    this.client.connect().catch((error) => {
      Logger.error('Redis connection error:', error, CACHE_DRIVER_NAME);
    });

    this.client.on('error', (error) => {
      Logger.error('Redis error:', error, CACHE_DRIVER_NAME);
    });

    this.client.on('ready', () => {
      Logger.log('Redis client is ready', CACHE_DRIVER_NAME);
    });

    this.client.on('end', () => {
      Logger.log('Redis client connection closed', CACHE_DRIVER_NAME);
    });
  }

  public async onApplicationShutdown(): Promise<void> {
    Logger.log('Closing Redis client connection', CACHE_DRIVER_NAME);
    await this.client.quit();
  }

  public async exists(key: string): Promise<boolean> {
    try {
      return Boolean(await this.client.exists(key));
    } catch (error: unknown) {
      // TODO: log error
      Logger.error(
        'Error checking if key exists in cache',
        error,
        'RedisDriver',
      );
      throw new Error('Error checking if key exists in cache');
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error: unknown) {
      // TODO: log error
      Logger.error('Error getting value from cache', error, CACHE_DRIVER_NAME);
      throw new Error('Error getting value from cache');
    }
  }

  public async set<T extends TCachableItem>(
    key: string,
    value: T,
    ttl?: number | undefined,
  ): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), ttl ? { EX: ttl } : {});
    } catch (error: unknown) {
      // TODO: log error
      Logger.error('Error setting value in cache', error, CACHE_DRIVER_NAME);
      throw new Error('Error setting value in cache');
    }
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async clear(): Promise<void> {
    await this.client.flushAll();
  }
}
