import IORedis from 'ioredis';

import { BaseChecker } from './base';

interface RedisCheckerOption {
  host?: string;

  port?: number;
}

interface CheckOption {
  max?: number
}

export class RedisChecker extends BaseChecker {
  private client: IORedis.Redis;

  constructor(options?: RedisCheckerOption) {
    super();

    this.client = new IORedis({
      host: options?.host || 'localhost',
      port: options?.port || 6379,
    });
  }

  async checkAndSet(key: string, ttl: number, options?: CheckOption) {
    const data = await this.client
      .pipeline()
      .incr(key)
      .expire(key, ttl)
      .exec();

    const max = options?.max || 1;
    const value = data[0][1];

    return value <= max;
  }
}
