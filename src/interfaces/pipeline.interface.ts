import { MiddlewareContextInterface } from './middleware-context.interface';
import { MiddlewareLikeType } from './middleware-like.type';
import { MonoidInterface } from './monoid.interface';

/**
 * Middleware pipeline descriptor.
 *
 * @interface PipelineInterface<TIntermediate = {}, TContext extends MiddlewareContextInterface =
 * MiddlewareContextInterface<TIntermediate>>
 * @extends MonoidInterface
 *
 * @type {TIntermediate} describes the middleware context intermediate. Defaults to `{}`.
 * @type {TContext} describes the middleware context itself. It overrides the TIntermediate type and is useful in
 * cases where not only the ctx.intermediate is amended. Defaults to `MiddlewareContextInterface<TIntermediate>`.
 */
export interface PipelineInterface<TIntermediate = {}, TContext = MiddlewareContextInterface<TIntermediate>>
  extends MonoidInterface<TIntermediate> {
  /**
   * Pipeline has no middleware flag.
   */
  isEmpty: boolean;

  /**
   * Iterator done flag.
   */
  done: boolean;

  /**
   * Array of internally stored middleware.
   */
  middleware: Array<MiddlewareLikeType<TContext>>;

  /**
   * Sequentially process middleware stored in current Pipeline beginning with the leftmost Middleware item.
   *
   * @param {TContext} ctx
   * @returns {Promise<any>}
   */
  process(ctx: TContext): Promise<any>;
}
