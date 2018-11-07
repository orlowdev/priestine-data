export interface MiddlewareFunctionInterface<T> {
  (x: T): T;
}
