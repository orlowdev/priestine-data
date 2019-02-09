import { BasePipeline } from './base-pipeline';
import { isMiddlewareContext, isMiddlewareObject } from './guards';
import { MiddlewareContextInterface, MiddlewareLikeType, PipelineInterface } from './interfaces';

/**
 * SyncPipeline sequentially executes internally stored middleware against the context provided as .process argument.
 * Unlike `@priestine/data` Pipeline monoid, SyncPipeline does not resolve Promises along the way nor it returns a
 * Promise in the end.
 *
 * @implements IterableIterator
 * @implements PipelineInterface
 */
export class SyncPipeline<
  TIntermediate = {},
  TContext = MiddlewareContextInterface<TIntermediate>
> extends BasePipeline<TIntermediate, TContext> {
  /**
   * Pointer interface for lifting given pieces of middleware to a SyncPipeline.
   *
   * @param {...MiddlewareLikeType<TIntermediate>} middleware
   * @returns {Pipeline<TIntermediate>}
   */
  public static of<TIntermediate = {}, TContext = MiddlewareContextInterface<TIntermediate>>(
    ...middleware: Array<MiddlewareLikeType<TContext>>
  ): SyncPipeline<TIntermediate, TContext> {
    return new SyncPipeline<TIntermediate, TContext>(middleware);
  }

  /**
   * Pointer interface for creating a SyncPipeline from array of middleware.
   *
   * @param {Array<MiddlewareLikeType<TIntermediate>>} middleware
   * @returns {Pipeline<TIntermediate>}
   */
  public static from<TIntermediate = {}, TContext = MiddlewareContextInterface<TIntermediate>>(
    middleware: Array<MiddlewareLikeType<TContext>>
  ): SyncPipeline<TIntermediate, TContext> {
    return new SyncPipeline<TIntermediate, TContext>([...middleware]);
  }

  /**
   * Pointer interface for creating an empty pipeline. Context type is optional and defaults to
   * MiddlewareContextInterface<unknown>.
   *
   * @returns {Pipeline<any>}
   */
  public static empty<TIntermediate = unknown, TContext = MiddlewareContextInterface<TIntermediate>>(): SyncPipeline<
    TIntermediate,
    TContext
  > {
    return new SyncPipeline<TIntermediate, TContext>([]);
  }

  /**
   * Sequentially process middleware internally stored in the Pipeline.
   *
   * If the middleware currently being executed returns a Promise, the Promise will be resolved before moving on to
   * the next middleware. Pipeline does not block the event loop. To avoid resolving the Promise, assign it to a key
   * of the middleware context and return void.
   *
   * @param {TContext} ctx
   * @returns {any}
   */
  public process(ctx: TContext): any {
    if (this.isEmpty) {
      this._done = true;
    }

    while (!this.done) {
      try {
        const next = this.next().value;
        const process: any = isMiddlewareObject(next) ? next.process : next;
        const result = process(ctx);

        if (result) {
          if (isMiddlewareContext(ctx)) ctx.intermediate = result;
          else ctx = result;
        }
      } catch (e) {
        if (isMiddlewareContext(ctx)) {
          ctx.error = e;
        }

        break;
      }
    }

    return ctx;
  }
}

console.log(
  SyncPipeline.of<any, number>((x) => x + 1)
    .concat(SyncPipeline.of((x) => x - 1))
    .concat(SyncPipeline.of((x) => x * 2))
    .process(1)
);
