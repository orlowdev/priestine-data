import { EitherInterface } from './interfaces/either.interface';
import { Left } from './left';
import { Right } from './right';

/**
 * Logical disjunction between `Right` and `Left`.
 * @class Either
 */
export abstract class Either<T> {
  /**
   * Construct an Either from a nullable type.
   * @param {T} x
   * @returns {EitherInterface<T>}
   */
  public static fromNullable<T>(x: T): EitherInterface<T> {
    return x != null ? Either.of(x) : Either.left(x);
  }

  /**
   * Construct an Either from a synchronous computation that may throw errors.
   * @param {() => T} f
   * @returns {EitherInterface<T>}
   */
  public static try<T>(f: () => T): EitherInterface<T> {
    try {
      return Either.of(f());
    } catch (e) {
      return Either.left(e);
    }
  }

  /**
   * Create a Right.
   * @param {T} x
   * @returns {Right<T>}
   */
  public static of<T>(x: T) {
    return Right.of(x);
  }

  /**
   * Create a left.
   * @param {T} x
   * @returns {Left<T>}
   */
  public static left<T>(x: T) {
    return Left.of(x);
  }
}
