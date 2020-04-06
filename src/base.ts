export abstract class BaseChecker {
  // eslint-disable-next-line class-methods-use-this
  abstract checkAndSet(key: string, ttl: number, options?: any): boolean;
}
