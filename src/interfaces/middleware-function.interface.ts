import { MiddlewareContextInterface } from './middleware-context.interface';

/**
 * Middleware function interface describes the function requirements to be considered a Middleware function.
 *
 * @interface {MiddlewareFunctionInterface<TContext extends MiddlewareContextInterface = MiddlewareContextInterface>}
 */
export interface MiddlewareFunctionInterface<TContext = MiddlewareContextInterface> {
  (ctx: TContext): TContext | any;
}
