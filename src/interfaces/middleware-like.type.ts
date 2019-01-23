import { MiddlewareContextInterface } from './middleware-context.interface';
import { MiddlewareFunctionInterface } from './middleware-function.interface';
import { MiddlewareInterface } from './middleware.interface';

/**
 * Descriptor for Middleware represented as either class-based or function middleware.
 * HINT: do not try to implement it in class-based middleware, use MiddlewareInterface interface instead.
 *
 * @type MiddlewareFunctionInterface | MiddlewareInterface
 */
export type MiddlewareLikeType<TContext = MiddlewareContextInterface> =
  | MiddlewareInterface<TContext>
  | MiddlewareFunctionInterface<TContext>;
