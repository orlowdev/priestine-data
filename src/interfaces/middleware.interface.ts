import { MonoidInterface } from './monoid.interface';

export interface MiddlewareInterface<T> extends MonoidInterface<T> {
  process(x: T): Promise<T>;
}
