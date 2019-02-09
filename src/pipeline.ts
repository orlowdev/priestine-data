import { BasePipeline } from './base-pipeline';
import { isMiddlewareContext, isMiddlewareObject } from './guards';
import { MiddlewareContextInterface, MiddlewareLikeType, PipelineInterface } from './interfaces';

/**
 * Pipeline sequentially executes internally stored middleware against the context provided as .process argument.
 *
 * @implements IterableIterator
 * @implements PipelineInterface
 */
export class Pipeline<TIntermediate = {}, TContext = MiddlewareContextInterface<TIntermediate>> extends BasePipeline<
  TIntermediate,
  TContext
> {
  /**
   * Pointer interface for lifting given pieces of middleware to a Pipeline.
   *
   * @param {...MiddlewareLikeType<TIntermediate>} middleware
   * @returns {Pipeline<TIntermediate>}
   */
  public static of<TIntermediate = {}, TContext = MiddlewareContextInterface<TIntermediate>>(
    ...middleware: Array<MiddlewareLikeType<TContext>>
  ): Pipeline<TIntermediate, TContext> {
    return new Pipeline<TIntermediate, TContext>(middleware);
  }

  /**
   * Pointer interface for creating a Pipeline from array of middleware.
   *
   * @param {Array<MiddlewareLikeType<TIntermediate>>} middleware
   * @returns {Pipeline<TIntermediate>}
   */
  public static from<TIntermediate = {}, TContext = MiddlewareContextInterface<TIntermediate>>(
    middleware: Array<MiddlewareLikeType<TContext>>
  ): Pipeline<TIntermediate, TContext> {
    return new Pipeline<TIntermediate, TContext>([...middleware]);
  }

  /**
   * Pointer interface for creating an empty pipeline. Context type is optional and defaults to
   * MiddlewareContextInterface<unknown>.
   *
   * @returns {Pipeline<any>}
   */
  public static empty<TIntermediate = unknown, TContext = MiddlewareContextInterface<TIntermediate>>(): Pipeline<
    TIntermediate,
    TContext
  > {
    return new Pipeline<TIntermediate, TContext>([]);
  }

  /**
   * Sequentially process middleware internally stored in the Pipeline.
   *
   * If the middleware currently being executed returns a Promise, the Promise will be resolved before moving on to
   * the next middleware. Pipeline does not block the event loop. To avoid resolving the Promise, assign it to a key
   * of the middleware context and return void.
   *
   * @param {TContext} ctx
   * @returns {Promise<any>}
   */
  public async process(ctx: TContext): Promise<any> {
    if (this.isEmpty) {
      this._done = true;
    }

    while (!this.done) {
      try {
        const next = this.next().value;
        const process: any = isMiddlewareObject(next) ? next.process : next;
        const result = await process(ctx);

        if (result) {
          if (isMiddlewareContext(ctx)) ctx.intermediate = result;
          else ctx = result;
        }
      } catch (e) {
        // TODO: Check if ctx is object and non-null
        if (isMiddlewareContext(ctx)) {
          ctx.error = e;
        }

        break;
        // TODO: Test support for working with context that does not implement MiddlewareContextInterface
        // TODO: Coverage 100%
      }
    }

    return ctx;
  }
}
