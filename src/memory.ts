// eslint-disable-next-line no-unused-vars
import { BaseChecker, CheckerOption } from './base';

export class MemoryChecker extends BaseChecker {
  private storage: any[];

  private timerId: NodeJS.Timeout | null;

  constructor(options?: CheckerOption) {
    super(options);

    this.storage = [];
    this.timerId = null;
  }

  checkAndSet(key: string, ttl: number, options?: any) {
    if (!key || typeof key !== 'string' || key.length <= 0) {
      throw new TypeError('key was not string or key was empty');
    }

    if (!ttl || typeof ttl !== 'number' || ttl < 0) {
      throw new TypeError('ttl was not number or ttl less than zero');
    }

    const index = this.storage.findIndex((x: any) => x.key === key);
    const item = index >= 0 ? this.storage[index] : null;

    // item is exist and it is not expired
    if (item && item.expire > Date.now()) {
      if (item.maxCount > 0) {
        item.count += 1;
        return item.count < item.maxCount;
      }

      return false;
    }

    if (!item) {
      this.storage.push({
        key,
        expire: Date.now() + ttl,
        count: 1,
        clearCount: 1,
        maxCount: options && options.maxCount,
      });
    } else {
      item.expire = Date.now() + ttl;
      item.count = 1;
      item.clearCount += 1;
      item.maxCount = options && options.maxCount;
    }

    if (!this.timerId) {
      this.timerId = setInterval(() => {
        if (this.storage.length > 0) {
          // remove expired items.
          this.storage = this.storage.filter(
            (e: any) => (e.expire > Date.now() && e.clearCount > 0),
          );

          this.storage.forEach((e: any) => {
            e.clearCount -= 1;
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
