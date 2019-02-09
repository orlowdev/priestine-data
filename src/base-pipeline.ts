import { MiddlewareContextInterface, MiddlewareLikeType, PipelineInterface } from './interfaces';

/**
 * Shared pipeline code.
 *
 * @implements IterableIterator
 * @implements PipelineInterface
 */
export abstract class BasePipeline<TIntermediate = {}, TContext = MiddlewareContextInterface<TIntermediate>>
  implements PipelineInterface<TIntermediate, TContext> {
  /**
   * Internally stored array of middleware.
   *
   * @type MiddlewareLikeType[]
   * @protected
   */
  protected readonly _middleware: Array<MiddlewareLikeType<TContext>>;

  /**
   * Current iteration index.
   *
   * @type {number}
   * @protected
   */
  protected _index: number = 0;

  /**
   * Iterator done flag.
   *
   * @type {boolean}
   * @protected
   */
  protected _done: boolean = false;

  /**
   * @constructor
   * @param {MiddlewareLikeType[]} middleware
   */
  protected constructor(middleware: Array<MiddlewareLikeType<TContext>>) {
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
   * @returns {PipelineInterface<TIntermediate>}
   */
  public concat(x: PipelineInterface<TIntermediate, TContext>): PipelineInterface<TIntermediate, TContext> {
    return (this.constructor as any).from(this.middleware.concat(x.middleware));
  }

  /**
   * Create a pipeline that has no middleware.
   *
   * @returns {Pipeline<TIntermediate>}
   */
  public empty(): PipelineInterface<TIntermediate> {
    return (this.constructor as any).empty() as any;
  }

  /**
   * Sequentially process middleware internally stored in the pipeline.
   *
   * If the middleware currently being executed returns a Promise, the Promise will be resolved before moving on to
   * the next middleware. Pipeline does not block the event loop. To avoid resolving the Promise, assign it to a key
   * of the middleware context and return void.
   *
   * @param {TContext} ctx
   * @returns {Promise<any>}
   */
  public abstract process(ctx: TContext): any;

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
