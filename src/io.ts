import { ApplicativeInterface } from './interfaces/applicative.interface';
import { MonadInterface } from './interfaces/monad.interface';

/**
 * @class IO
 */
export class IO<T> implements ApplicativeInterface<T>, MonadInterface<T> {
  /**
   * Create an IO from given function.
   * @param {(...args: any[]) => T} func
   * @returns {IO<T>}
   */
  public static from<T>(func: (...args: any[]) => T): IO<T> {
    return new this[Symbol.species](func);
  }

  /**
   * Create an IO from a function that returns given value.
   * @param {T} value
   * @returns {IO<T>}
   */
  public static of<T>(value: T): IO<T> {
    return IO.from(() => value);
  }

  /**
   * @returns {any}
   */
  public static get [Symbol.species](): any {
    return this;
  }

  /**
   * @constructor
   * @param {() => T} effect
   */
  public constructor(protected readonly effect: () => T) {
    if (typeof effect !== 'function') {
      throw new Error('IO Usage: Function required!');
    }
  }

  /**
   * Create an IO from a function that returns given value.
   * @param {TNewValue} value
   * @returns {IO<TNewValue>}
   */
  public of<TNewValue>(value: TNewValue): IO<TNewValue> {
    return IO.of(value);
  }

  /**
   * Transform effect of the IO using a regular unary function
   * @param {(x: T) => TNewResult} f
   * @returns {IO<TNewResult>}
   */
  public map<TNewResult>(f: (x: T) => TNewResult): IO<TNewResult> {
    return IO.of(f(this.effect()));
  }

  /**
   * Apply value of provided `IO[a -> y]` to current effect value.
   * @param {IO<TAnother>} x
   * @returns {IO<TNewResult>}
   */
  public ap<TAnother, TNewResult>(x: IO<TAnother>): IO<TNewResult> {
    return x.map(this.effect as () => any);
  }

  /**
   * Transform the value of the `IO[a]` using a function to a monad.
   * @param {(x: T) => TNewResult} f
   * @returns {TNewResult}
   */
  public chain<TNewResult>(f: (x: T) => TNewResult): TNewResult {
    return f(this.effect());
  }

  /**
   * Execute IO effect.
   * @returns {T}
   */
  public run(): T {
    return this.effect();
  }

  /**
   * @returns {string}
   */
  public get [Symbol.toStringTag]() {
    return 'IO';
  }
}
