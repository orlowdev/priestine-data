import { MonadInterface } from './monad.interface';
import { SemigroupInterface } from './semigroup.interface';
import { SetoidInterface } from './setoid.interface';

/**
 * Logical disjunction between `Right` and `Left`.
 * @interface EitherInterface<T>
 */
export interface EitherInterface<T> extends SetoidInterface<T>, SemigroupInterface<T>, MonadInterface<T> {
  /**
   * @param {(x: T) => TLeft} f
   * @param {(x: T) => TRight} g
   * @returns {TLeft | TRight}
   */
  fold<TLeft, TRight>(f: (x: T) => TLeft, g: (x: T) => TRight): TLeft | TRight;

  /**
   * @returns {T}
   */
  unsafeGet(): T;
}
