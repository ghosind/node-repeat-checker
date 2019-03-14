const assert = require('assert');

const Checker = require('../index');

const checker = new Checker({ clearTime: 1000 });

describe('Repeat Checker', () => {
  describe('pass an empty key', () => {
    it('should throw TypeError', () => {
      let errored = 0;
      try {
        checker.checkAndSet('', 1000);
      } catch (err) {
        errored = 1;
      }
      assert.equal(errored, 1);
    });
  });

  describe('pass an negative ttl', () => {
    it('should throw TypeError', () => {
      let errored = 0;
      try {
        checker.checkAndSet('ttl', -1);
      } catch (err) {
        errored = 1;
      }
      assert.equal(errored, 1);
    });
  });

  describe('set key1 once', () => {
    it('should return true', () => {
      const result = checker.checkAndSet('key1', 1000);
      assert.equal(result, true);
    });
  });

  describe('set key2 twice', () => {
    it('shold return true and false', () => {
      // set first time
      let result = checker.checkAndSet('key2', 1000);
      assert.equal(result, true);

      // set second time
      result = checker.checkAndSet('key2', 1000);
      assert.equal(result, false);
    });
  });

  describe('set key3 and key 4 once', () => {
    it('shold both return true', () => {
      let result = checker.checkAndSet('key3', 1000);
      assert.equal(result, true);

      result = checker.checkAndSet('key4', 1000);
      assert.equal(result, true);
    });
  });

  describe('set key5 twice between 1s and ttl is 1.5s', () => {
    it('shold return true and false', (done) => {
      let result = checker.checkAndSet('key5', 1500);
      assert.equal(result, true);

      setTimeout(() => {
        result = checker.checkAndSet('key5', 1500);
        assert.equal(result, false);
        done();
      }, 1000);
    });
  });

  describe('set key6 twice between 1s and ttl is 0.5s', () => {
    it('shold both return true', (done) => {
      let result = checker.checkAndSet('key6', 500);
      assert.equal(result, true);

      setTimeout(() => {
        result = checker.checkAndSet('key6', 500);
        assert.equal(result, true);
        done();
      }, 1000);
    });
  });

  describe('use count restrict', () => {
    it('shold return true at first 2 times, and return false at last time', () => {
      let result = checker.checkAndSet('count', 1000, { maxCount: 3 });
      assert.equal(result, true);

      result = checker.checkAndSet('count', 1000, { maxCount: 3 });
      assert.equal(result, true);

      result = checker.checkAndSet('count', 1000, { maxCount: 3 });
      assert.equal(result, false);
    });
  });
});
