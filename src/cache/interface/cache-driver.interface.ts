import { TCachableItem } from '@src/cache/types/cachable-item.type';

export interface ICacheDriver {
  exists(key: string): Promise<boolean>;
  get<T>(key: string): Promise<T | null>;
  set<T extends TCachableItem>(
    key: string,
    value: T,
    ttl?: number,
  ): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
