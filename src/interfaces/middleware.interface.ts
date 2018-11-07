import { SemigroupInterface } from './semigroup.interface';

export interface MiddlewareInterface<T> extends SemigroupInterface<T> {
  process(x: T): Promise<T>;
}
