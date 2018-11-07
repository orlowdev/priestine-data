import { MiddlewareInterface } from './interfaces';
import { MiddlewareFunctionInterface } from './interfaces';
import { Pipeline } from './pipeline';

/**
 * Middleware represents a unit of work. Middleware must always return the same type it accepts as `process`
 * argument. Middleware can be used inside a pipeline or used separately. Concatenating Middleware will produce a
 * Pipeline of concatenated Middleware. Middleware does not get triggered until `middleware.process` method is used.
 * Pipeline executes `middleware.process` under the hood by itself. `middleware.process` always returns a regular
 * Promise that you can `.then` and `.catch`.
 * @class Middleware
 */
export class Middleware<TContext> implements MiddlewareInterface<TContext> {
  /**
   * Lift a function into Middleware.
   * @param {MiddlewareFunctionInterface<TContext>} effect
   * @returns {Middleware<TContext>}
   */
  public static of<TContext>(effect: MiddlewareFunctionInterface<TContext>): Middleware<TContext> {
    return new Middleware<TContext>(effect);
  }

  /**
   * @constructor
   * @param {MiddlewareFunctionInterface<TContext>} effect
   */
  public constructor(readonly effect: MiddlewareFunctionInterface<TContext>) {
    if (typeof effect !== 'function') {
      throw new Error('Middleware Usage: Function required!');
    }
  }

  /**
   * Process internal function of the Middleware.
   * @param {TContext} ctx
   * @returns {Promise<TContext>}
   */
  public process(ctx: TContext): Promise<TContext> {
    return Promise.resolve(this.effect(ctx));
  }

  /**
   * Produce a new Pipeline that will internally store both current Middleware and the Middleware provided as an
   * argument.
   * @param {MiddlewareInterface<TContext>} x
   * @returns {Pipeline<TContext>}
   */
  public concat(x: MiddlewareInterface<TContext>) {
    return Pipeline.of([this, x]);
  }
}
