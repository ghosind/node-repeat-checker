export abstract class BaseChecker {
  abstract checkAndSet(key: string, ttl: number, options?: any): boolean;
}
