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
   */
  checkAndSet(key, ttl) {
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
      return false;
    }

    this[sStore].push({
      key,
      expire: Date.now() + ttl,
    });

    if (!this[sClearTimer]) {
      this[sClearTimer] = setInterval(() => {
        if (this[sStore].length > 0) {
          // remove expired items.
          this[sStore] = this[sStore].filter(x => x.expire > Date.now());
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
