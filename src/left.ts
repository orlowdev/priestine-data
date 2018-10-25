import { Either } from './either';
import { EitherInterface } from './interfaces/either.interface';
import { Right } from './right';

/**
 * @class Left
 */
export class Left<T> implements EitherInterface<T> {
  /**
   * Lift a value into Either.
   * @param {TNewValue} x
   * @returns {Left<TNewValue>}
   */
  public static of<TNewValue>(x: TNewValue): Left<TNewValue> {
    return new Left<TNewValue>(x);
  }

  /**
   * @returns {any}
   */
  public static get [Symbol.species](): any {
    return this;
  }

  /**
   * Internally stored value.
   */
  protected readonly _value: T;

  /**
   * @constructor
   * @param {T} x
   */
  public constructor(x: T) {
    this._value = x;
  }

  /**
   * Apply the function value of current Either to another Either.
   * @param {Left<TAnotherValue>} v
   * @returns {Left<TNewValue>}
   */
  public ap<TAnotherValue, TNewValue>(v: Left<TAnotherValue>): Left<TNewValue> {
    return this as Left<any>;
  }

  /**
   * Transform the Left value of the Either using a unary function to monad.
   * @param {(x: T) => Left<TNewValue>} f
   * @returns {Left<TNewValue>}
   */
  public chain<TNewValue>(f: (x: T) => EitherInterface<TNewValue>): Left<TNewValue> {
    return this as Left<any>;
  }

  /**
   * Concat the Left value of the Either with another Left or keep Left on either side.
   * @param {Left<T>} x
   * @returns {Left<T>}
   */
  public concat<TAnother>(x: EitherInterface<TAnother>): Left<T> {
    return this;
  }

  /**
   * Transform internal value of the either.
   * @param {(e: T) => TNewResult} f
   * @returns {FunctorInterface<TNewResult>}
   */
  public map<TAnother, TNewResult>(f: (e: T) => TNewResult): Left<TNewResult> {
    return this as Left<any>;
  }

  /**
   * Lift a value into Either.
   * @param {TNewValue} x
   * @returns {Left<TNewValue>}
   */
  public of<TNewValue>(x: TNewValue): Left<TNewValue> {
    return Left.of(x);
  }

  /**
   * Unsafely get internal value of the Either.
   * @returns {T}
   */
  public unsafeGet(): T {
    return this._value;
  }

  /**
   * Swap disjunction values.
   * @returns {Right<T>}
   */
  public swap(): Right<T> {
    return Either.of(this._value);
  }

  /**
   * Get value fot the Either if in its Leftmost case or run provided function.
   * @param {(x: T) => TNewResult} f
   * @returns {T}
   */
  public getOrElse<TNewResult>(f: () => TNewResult) {
    return f();
  }

  /**
   * Safely get value of the Either.
   * @param {<TLeftResult>(x: T) => TLeftResult} f
   * @param {<TLeftResult>(x: T) => TLeftResult} g
   * @returns {any}
   */
  public fold<TLeftResult>(f: (x: T) => TLeftResult, g: (x: T) => any): TLeftResult {
    return f(this._value);
  }

  /**
   * Test if the Either equals another Either.
   * @param {Left<T | TAnother>} x
   * @returns {boolean}
   */
  public equals<TAnother>(x: Left<T | TAnother>): boolean {
    return x.isLeft && x._value === this._value;
  }

  /**
   * Approval for Either to be Left.
   * @returns {boolean}
   */
  public get isRight(): boolean {
    return false;
  }

  /**
   * Approval for Either to be Left.
   * @returns {boolean}
   */
  public get isLeft(): boolean {
    return true;
  }

  /**
   * @returns {string}
   */
  public toString(): string {
    return `Left(${this._value})`;
  }

  /**
   * @returns {string}
   */
  public get [Symbol.toStringTag](): string {
    return 'Left';
  }
}
