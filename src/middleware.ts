import { FunctorInterface, MiddlewareInterface } from './interfaces';
import { Pipeline } from './pipeline';

/**
 * Middleware represents a unit of work. Middleware must always return the same type it accepts as `process`
 * argument. Middleware can be used inside a pipeline or used separately. Concatenating Middleware will produce a
 * Pipeline of concatenated Middleware. Middleware does not get triggered until `middleware.process` method is used.
 * Pipeline executes `middleware.process` under the hood by itself. `middleware.process` always returns a regular
 * Promise that you can `.then` and `.catch`.
 * @class Middleware
 */
export class Middleware<TContext, TOriginal> implements FunctorInterface<TContext>, MiddlewareInterface<TOriginal> {
  /**
   * Lift a function into Middleware.
   * @param {(x: TContext) => TResult} effect
   * @returns {Middleware<TContext>}
   */
  public static of<TContext, TResult>(effect: (x: TContext) => TResult): Middleware<TResult, TContext> {
    return new Middleware<TResult, TContext>(effect);
  }

  /**
   * Create a Middleware that represents an I-Combinator.
   * @returns {Middleware<any, any>}
   */
  public static empty(): Middleware<any, any> {
    return Middleware.of((x) => x);
  }

  /**
   * @constructor
   */
  public constructor(readonly effect: (x: TOriginal) => any) {
    if (typeof effect !== 'function') {
      throw new Error('Middleware Usage: Function required!');
    }
  }

  /**
   * Process internal function of the Middleware.
   * @param {TOriginal} ctx
   * @returns {Promise<TOriginal>}
   */
  public process(ctx: TOriginal): Promise<TOriginal> {
    return Promise.resolve(this.effect(ctx));
  }

  /**
   * Produce a new Pipeline that will internally store both current Middleware and the Middleware provided as an
   * argument.
   * @param {MiddlewareInterface<TNewResult>} x
   * @returns {Pipeline<TNewResult, TOriginal>}
   */
  public concat<TNewResult>(x: MiddlewareInterface<TNewResult>): Pipeline<TNewResult, TOriginal> {
    return Pipeline.of<TNewResult, TOriginal>([this as any, x]);
  }

  /**
   * Create a Middleware that represents an I-Combinator.
   * @returns {Middleware<any, any>}
   */
  public empty(): Middleware<any, any> {
    return Middleware.empty();
  }

  /**
   * Produce a new Pipeline that will internally store both current Middleware and the Middleware.of function provided
   * as an argument.
   * @param {(e: TContext) => TNewResult} f
   * @returns {Pipeline<TNewResult>}
   */
  public map<TNewResult>(f: (e: TContext) => TNewResult): Pipeline<TNewResult, TOriginal> {
    return Pipeline.of<TNewResult, TOriginal>([this, Middleware.of(f)] as any);
  }
}
