import { Either } from './either';
import { EitherInterface } from './interfaces/either.interface';
import { Left } from './left';

/**
 * @class Right
 */
export class Right<T> implements EitherInterface<T> {
  /**
   * Lift a value into Either.
   * @param {TNewValue} x
   * @returns {Right<TNewValue>}
   */
  public static of<TNewValue>(x: TNewValue): Right<TNewValue> {
    return new Right<TNewValue>(x);
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
   * @param {Right<TAnotherValue>} v
   * @returns {Right<TNewValue>}
   */
  public ap<TAnotherValue, TNewValue>(v: Right<TAnotherValue>): Right<TNewValue> {
    return v.map(this._value as any);
  }

  /**
   * Transform the Right value of the Either using a unary function to monad.
   * @param {(x: T) => Right<TNewValue>} f
   * @returns {Right<TNewValue>}
   */
  public chain<TNewValue>(f: (x: T) => EitherInterface<TNewValue>): EitherInterface<TNewValue> {
    return f(this._value);
  }

  /**
   * Concat the Right value of the Either with another Right or keep Left on either side.
   * @param {Right<T>} x
   * @returns {Right<T>}
   */
  public concat<TAnother>(x: EitherInterface<TAnother>): Right<TAnother> {
    const thisValue = this._value;
    return x.fold((x) => Left.of(x), (v) => Right.of((thisValue as any).concat(v as any))) as Right<TAnother>;
  }

  /**
   * Transform internal value of the either.
   * @param {(e: T) => TNewResult} f
   * @returns {FunctorInterface<TNewResult>}
   */
  public map<TAnother, TNewResult>(f: (e: T) => TNewResult): Right<TNewResult> {
    return Right.of(f(this._value));
  }

  /**
   * Lift a value into Either.
   * @param {TNewValue} x
   * @returns {Right<TNewValue>}
   */
  public of<TNewValue>(x: TNewValue): Right<TNewValue> {
    return Right.of(x);
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
   * @returns {Left<T>}
   */
  public swap(): Left<T> {
    return Either.left(this._value);
  }

  /**
   * Get value fot the Either if in its Rightmost case or run provided function.
   * @param {(x: T) => TNewResult} f
   * @returns {T}
   */
  public getOrElse<TNewResult>(f: () => TNewResult) {
    return this._value;
  }

  /**
   * Safely get value of the Either.
   * @param {<TLeftResult>(x: T) => TLeftResult} f
   * @param {<TRightResult>(x: T) => TRightResult} g
   * @returns {any}
   */
  public fold<TRightResult>(f: (x: T) => any, g: (x: T) => TRightResult): TRightResult {
    return g(this._value);
  }

  /**
   * Test if the Either equals another Either.
   * @param {Right<T | TAnother>} x
   * @returns {boolean}
   */
  public equals<TAnother>(x: Right<T | TAnother>): boolean {
    return x.isRight && x._value === this._value;
  }

  /**
   * Approval for Either to be Right.
   * @returns {boolean}
   */
  public get isRight(): boolean {
    return true;
  }

  /**
   * Approval for Either to be Left.
   * @returns {boolean}
   */
  public get isLeft(): boolean {
    return false;
  }

  /**
   * @returns {string}
   */
  public toString(): string {
    return `Right(${this._value})`;
  }

  /**
   * @returns {string}
   */
  public get [Symbol.toStringTag](): string {
    return 'Right';
  }
}
