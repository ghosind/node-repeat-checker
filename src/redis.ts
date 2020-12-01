import { BaseChecker } from './base';

interface RedisCheckerOption {
  host?: string;

  port?: number;
}

interface CheckOption {
  max?: number
}

export class RedisChecker extends BaseChecker {
  private client: any;

  private checkScript: string = `
  if redis.call("get", KEYS[1]) >= ARGV[2]
  then
    return 1
  end

  redis.call("incr", KEYS[1])
  redis.call("expires", KEYS[1], ARGV[1])

  return 0
  `

  constructor(options?: RedisCheckerOption) {
    super();

    // eslint-disable-next-line max-len
    // eslint-disable-next-line import/no-unresolved, global-require, import/no-extraneous-dependencies
    const IORedis = require('ioredis');
    if (!IORedis) {
      throw new Error('Please install ioredis first. (npm install ioredis)');
    }

    this.client = new IORedis({
      host: options?.host || 'localhost',
      port: options?.port || 6379,
    });

    if (!this.client) {
      throw new Error('Failed to create redis connect');
    }

    this.client.defineCommand('check', {
      numberOfKeys: 1,
      lua: this.checkScript,
    });
  }

  async checkAndSet(key: string, ttl: number, options?: CheckOption) {
    if (!key) {
      throw new TypeError('Invalid locker key');
    }

    if (!ttl) {
      throw new TypeError('Invalid ttl');
    }

    return new Promise(
      (resolve: (value: any) => void, reject: (value: any) => void) => {
        this.client.check(
          key,
          ttl,
          (options && options.max) || 1,
          (err: any, result: any) => {
            if (err) {
              return reject(err);
            }
            return resolve(!result);
          },
        );
      },
    );
  }
}
