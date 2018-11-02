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
  fold<TLeft, TRight>(f: (x: T) => TLeft, g: (x: T) => TRight): any;

  /**
   * @returns {T}
   */
  unsafeGet(): T;

  /**
   * map :: Functor f => f a ~> (a -> b) -> f b
   * @param {(e: T) => TNewResult} f
   * @returns {EitherInterface<TNewResult>}
   */
  map<TNewResult>(f: (e: T) => TNewResult): EitherInterface<TNewResult>;

  /**
   * of :: Applicative f => a -> f a
   * @param {TValue} x
   * @returns {EitherInterface<TValue>}
   */
  of<TNewValue>(x: TNewValue): EitherInterface<TNewValue>;

  /**
   * ap :: Apply f => f a ~> f (a -> b) -> f b
   * @returns {EitherInterface<TAnotherValue>}
   * @param v
   */
  ap<TAnotherValue, TNewValue>(v: EitherInterface<TAnotherValue>): EitherInterface<TNewValue>;

  /**
   * chain :: Chain m => m a ~> (a -> m b) -> m b
   * @param {(x: TValue) => TNewValue} f
   * @returns {EitherInterface<TNewValue>}
   */
  chain<TNewValue>(f: (x: T) => EitherInterface<TNewValue>): EitherInterface<TNewValue>;

  /**
   * concat :: Semigroup a => a ~> a -> a
   * @param {EitherInterface} x
   * @returns {EitherInterface<TValue>}
   */
  concat<TValue>(x: EitherInterface<TValue>): EitherInterface<TValue>;

  /**
   * @param {T} x
   * @returns {EitherInterface<T>}
   */
  swap(x: T): EitherInterface<T>;

  /**
   * @param {() => TNewResult} f
   * @returns {TNewResult}
   */
  getOrElse<TNewResult>(f: () => TNewResult): TNewResult;

  isLeft: boolean;

  isRight: boolean;
}
