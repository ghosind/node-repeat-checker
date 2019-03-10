const sStore = Symbol('Store');

class Check {
  constructor() {
    this[sStore] = [];
  }

  checkAndSet(key, ttl) {
    const time = Date.now();

    const item = this[sStore].findIndex(x => (x.key == key && x.expire > time));

    if (item >= 0) {
      return false;
    }

    this[sStore].push({
      key,
      expire: time + ttl,
    });

    return true;
  }
}

module.exports = new Check();
