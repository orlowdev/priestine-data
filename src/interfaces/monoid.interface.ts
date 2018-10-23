import { SemigroupInterface } from './semigroup.interface';

export interface MonoidInterface<TValue> extends SemigroupInterface<TValue> {
  /**
   * empty :: Monoid m => () -> m
   * @returns {MonoidInterface<TValue>}
   */
  empty(): MonoidInterface<TValue>;
}
