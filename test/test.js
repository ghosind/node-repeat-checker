const assert = require('assert');

const Checker = require('../index');

const checker = new Checker();

describe('Repeat Checker', () => {
  describe('set key1 once', () => {
    it('should return true', () => {
      const result = checker.checkAndSet('key1', 10000);
      assert.equal(result, true);
    });
  });

  describe('set key2 twice', () => {
    it('shold return true and false', () => {
      // set first time
      let result = checker.checkAndSet('key2', 10000);
      assert.equal(result, true);

      // set second time
      result = checker.checkAndSet('key2', 10000);
      assert.equal(result, false);
    });
  });

  describe('set key3 and key 4 once', () => {
    it('shold both return true', () => {
      let result = checker.checkAndSet('key3', 10000);
      assert.equal(result, true);

      result = checker.checkAndSet('key4', 10000);
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
});
