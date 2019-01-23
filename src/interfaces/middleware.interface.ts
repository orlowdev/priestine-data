import { MiddlewareContextInterface } from './middleware-context.interface';

/**
 * Middleware descriptor. Each class-based middleware must implement this interface to be considered as such.
 *
 * @interface {MiddlewareInterface<TContext extends MiddlewareContextInterface = MiddlewareContextInterface>}
 */
export interface MiddlewareInterface<TContext = MiddlewareContextInterface> {
  /**
   * Process current middleware with context provided as an argument.
   *
   * @param {TContext} ctx
   * @returns {any}
   */
  process(ctx: TContext): TContext | any;
}
