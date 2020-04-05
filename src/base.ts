export interface CheckerOption {
  clearTime: 60; // 60s
}

export abstract class BaseChecker {
  protected clearTime: number;

  constructor(options?: CheckerOption) {
    this.clearTime = (options && options.clearTime) || 60; // 1 minute
  }

  // eslint-disable-next-line class-methods-use-this
  abstract checkAndSet(key: string, ttl: number, options?: any): boolean;
}
