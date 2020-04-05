// eslint-disable-next-line no-unused-vars
import { BaseChecker, CheckerOption } from './base';

export interface MemoryJob {
  count: number;

  clearCount: number;

  expired: number;

  maxCount: number;
}

interface CheckOptions {
  maxCount?: number;
}

export class MemoryChecker extends BaseChecker {
  private storage: Map<string, MemoryJob>;

  private timerId: NodeJS.Timeout | null;

  constructor(options?: CheckerOption) {
    super(options);

    this.storage = new Map();
    this.timerId = null;
  }

  checkAndSet(key: string, ttl: number, options?: CheckOptions) {
    if (!key || typeof key !== 'string' || key.length <= 0) {
      throw new TypeError('key was not string or key was empty');
    }

    if (!ttl || typeof ttl !== 'number' || ttl < 0) {
      throw new TypeError('ttl was not number or ttl less than zero');
    }

    const item = this.storage.get(key);

    // item is exist and it is not expired
    if (item && item.expired > Date.now()) {
      if (item.maxCount > 0) {
        item.count += 1;
        return item.count < item.maxCount;
      }

      return false;
    }

    if (!item) {
      this.storage.set(key, {
        expired: Date.now() + ttl,
        count: 1,
        clearCount: 1,
        maxCount: options?.maxCount || 1,
      });
    } else {
      item.expired = Date.now() + ttl;
      item.count = 1;
      item.clearCount += 1;
      item.maxCount = options?.maxCount || 1;
    }

    if (!this.timerId) {
      this.timerId = setInterval(() => {
        if (this.storage.size > 0) {
          this.storage.forEach((job: MemoryJob, jobKey: string) => {
            if (job.expired < Date.now() && job.clearCount <= 0) {
              this.storage.delete(jobKey);
            } else {
              // eslint-disable-next-line no-param-reassign
              job.clearCount -= 1;
            }
          });
        } else if (this.timerId) {
          // stop timer when the items list was empty.
          clearInterval(this.timerId);
          this.timerId = null;
        }
      }, this.clearTime * 1000);
    }

    return true;
  }
}
