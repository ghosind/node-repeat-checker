const sStore = Symbol('Store');
const sClearTimer = Symbol('clearTimer');
const sClearTime = Symbol('clearTime');

class Checker {
  /**
   * Create a new Checker instance.
   * @param {Object} options options
   * @param {Number} options.clearTime the interval time that set timer to clear expired items.
   */
  constructor(options) {
    this[sClearTime] = (options && options.clearTime) || 60000;
    this[sStore] = [];
    this[sClearTimer] = null;
  }

  /**
   * check key exist status, if not, set the key with ttl.
   * @param {String} key item key
   * @param {Number} ttl item ttl
   * @param {Object} options options
   * @param {Number} options.maxCount max number of use count
   */
  checkAndSet(key, ttl, options) {
    if (!key || typeof key !== 'string' || key.length <= 0) {
      throw new TypeError('key was not string or key was empty');
    }

    if (!ttl || typeof ttl !== 'number' || ttl < 0) {
      throw new TypeError('ttl was not number or ttl less than zero');
    }

    const index = this[sStore].findIndex(x => x.key === key);
    const item = index >= 0 ? this[sStore][index] : null;

    // item is exist and it is not expired
    if (item && item.expire > Date.now()) {
      if (item.maxCount > 0) {
        item.count += 1;
        return item.count < item.maxCount;
      }

      return false;
    }

    if (!item) {
      this[sStore].push({
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

    if (!this[sClearTimer]) {
      this[sClearTimer] = setInterval(() => {
        if (this[sStore].length > 0) {
          this[sStore].forEach((e) => {
            e.clearCount -= 1;
          });

          // remove expired items.
          this[sStore] = this[sStore].filter(e => (e.expire > Date.now() && e.clearCount > 0));
        } else {
          // stop timer when the items list was empty.
          clearInterval(this[sClearTimer]);
          this[sClearTimer] = null;
        }
      }, this[sClearTime]);
    }

    return true;
  }
}

module.exports = Checker;
