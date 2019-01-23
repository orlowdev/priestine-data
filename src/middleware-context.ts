import { MiddlewareContextInterface } from './interfaces';

/**
 * Static MiddlewareContext factory.
 */
export abstract class MiddlewareContext<T> {
  /**
   * Pointer interface for lifting a value to MiddlewareContext.
   *
   * @param {T} intermediate
   * @returns {MiddlewareContextInterface<T>}
   */
  public static of<T>(intermediate: T): MiddlewareContextInterface<T> {
    return { intermediate };
  }
}
