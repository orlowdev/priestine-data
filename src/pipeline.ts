import { isMiddlewareContext, isMiddlewareObject } from './guards';
import { MiddlewareContextInterface, MiddlewareLikeType, PipelineInterface } from './interfaces';

/**
 * Pipeline sequentially executes internally stored middleware against the context provided as .process argument.
 *
 * @implements IterableIterator
 * @implements PipelineInterface
 */
export class Pipeline<TIntermediate = {}, TContext = MiddlewareContextInterface<TIntermediate>>
  implements PipelineInterface<TIntermediate, TContext> {
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
   * Internally stored array of middleware.
   *
   * @type MiddlewareLikeType[]
   * @private
   */
  private readonly _middleware: Array<MiddlewareLikeType<TContext>>;

  /**
   * Current iteration index.
   *
   * @type {number}
   * @private
   */
  private _index: number = 0;

  /**
   * Iterator done flag.
   *
   * @type {boolean}
   * @private
   */
  private _done: boolean = false;

  /**
   * @constructor
   * @param {MiddlewareLikeType[]} middleware
   */
  public constructor(middleware: Array<MiddlewareLikeType<TContext>>) {
    this._middleware = middleware;
  }

  /**
   * Transform Pipeline to array of middleware.
   *
   * @returns {MiddlewareLikeType[]}
   */
  public toArray(): Array<MiddlewareLikeType<TContext>> {
    return this.middleware;
  }

  /**
   * Concat current middleware with argument pipeline of the same generic type.
   *
   * @param {PipelineInterface<TIntermediate>} x
   * @returns {Pipeline<TIntermediate>}
   */
  public concat(x: PipelineInterface<TIntermediate, TContext>): Pipeline<TIntermediate, TContext> {
    return Pipeline.from(this.middleware.concat(x.middleware));
  }

  /**
   * Create a Pipeline that has no middleware.
   *
   * @returns {Pipeline<TIntermediate>}
   */
  public empty(): Pipeline<TIntermediate> {
    return Pipeline.empty<TIntermediate>();
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

  /**
   * @returns {IterableIterator<MiddlewareLikeType>}
   */
  public [Symbol.iterator](): IterableIterator<MiddlewareLikeType<TContext>> {
    return this;
  }

  /**
   * @param {MiddlewareLikeType<TContext>} value
   * @returns {IteratorResult<MiddlewareLikeType<TContext>>}
   */
  public next(value?: MiddlewareLikeType<TContext>): IteratorResult<MiddlewareLikeType<TContext>> {
    this._done = this.isEmpty || this._index === this._middleware.length - 1;

    return {
      done: this._done,
      value: this._middleware[this._index++],
    };
  }

  /**
   * Getter for _isEmpty.
   *
   * @returns {boolean}
   */
  public get isEmpty(): boolean {
    return !this._middleware.length;
  }

  /**
   * Getter for _done.
   *
   * @returns {boolean}
   */
  public get done(): boolean {
    return this._done;
  }

  /**
   * Getter for _middleware.
   *
   * @returns {Array<MiddlewareLikeType<TContext>>}
   */
  public get middleware(): Array<MiddlewareLikeType<TContext>> {
    return this._middleware;
  }
}
