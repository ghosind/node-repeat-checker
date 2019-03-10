const sStore = Symbol('Store');
const sClearTimer = Symbol('clearTimer');
const sClearTime = Symbol('clearTime');

class Check {
  constructor(options) {
    this[sClearTime] = options.clearTime || 60000;
    this[sStore] = [];
    this[sClearTimer] = null;
  }

  checkAndSet(key, ttl) {
    const time = Date.now();

    const item = this[sStore].findIndex(x => (x.key === key && x.expire > time));

    if (item >= 0) {
      return false;
    }

    this[sStore].push({
      key,
      expire: time + ttl,
    });

    if (!this[sClearTimer]) {
      this[sClearTimer] = setTimeout(() => {
        if (this[sStore].length > 0) {
          this[sStore] = this[sStore].filter(x => x.expire > Date.now());
        } else {
          clearTimeout(this[sClearTime]);
          this[sClearTime] = null;
        }
      }, this[sClearTime]);
    }

    return true;
  }
}

module.exports = new Check();
