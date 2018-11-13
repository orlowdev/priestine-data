import { FunctorInterface, MiddlewareInterface } from './interfaces';
import { Middleware } from './middleware';

/**
 * Pipeline represents linear execution of a set of Promise-based middleware. Pipeline and middleware can be used
 * interchangeably. Any extension of Middleware logic will produce creation of a Pipeline. Execution of the middleware
 * inside the Pipeline does not get triggered until you use the `pipeline.process` method. After the method finishes
 * executing middleware, it will return a regular Promise holding the final value which you cou can `.then` or `.catch`.
 * @class Pipeline
 */
export class Pipeline<TContext, TOriginal>
  implements
    MiddlewareInterface<TOriginal>,
    FunctorInterface<TContext>,
    IterableIterator<MiddlewareInterface<TContext>> {
  /**
   * Lift an array of functions into Pipeline.
   * @param {Array<(x: TContext) => TResult>} middleware
   * @returns {Pipeline<TContext, TContext>}
   */
  public static from<TContext, TResult>(middleware: Array<(x: TContext) => TResult>): Pipeline<TContext, TContext> {
    return new Pipeline<TContext, TContext>(middleware.map(Middleware.of));
  }

  /**
   * Lift an array of Middleware into Pipeline.
   * @param {Array<MiddlewareInterface<TContext>>} middleware
   * @returns {Pipeline<TContext, TOriginal>}
   */
  public static of<TContext, TOriginal>(
    middleware: Array<MiddlewareInterface<TContext>>
  ): Pipeline<TContext, TOriginal> {
    return new Pipeline<TContext, TOriginal>(middleware);
  }

  /**
   * Create a Pipeline that will yield `pipeline.process` argument.
   * @returns {Pipeline<any, any>}
   */
  public static empty(): Pipeline<any, any> {
    return Pipeline.of([Middleware.of((x) => x)]);
  }

  /**
   * Internally stored array of Middleware.
   */
  protected readonly _middleware: Array<MiddlewareInterface<TContext>>;

  /**
   * Current iteration index.
   */
  protected _index: number;

  /**
   * @constructor
   * @param {Array<MiddlewareInterface<TContext>>} middleware
   */
  protected constructor(middleware: Array<MiddlewareInterface<TContext>>) {
    this._index = 0;
    this._middleware = middleware;
  }

  /**
   * Concat current Pipeline with provided MiddlewareInterface creating a new Pipeline. If argument is Pipeline,
   * internally stored Middleware of current Pipeline will be concatenated with internally stored Middleware of the
   * argument. If argument is a Middleware, it will be pushed into internally stored array of Middleware.
   * @param {MiddlewareInterface<TContext>} x
   * @returns {Pipeline<TContext>}
   */
  public concat<TNewResult>(x: MiddlewareInterface<TNewResult>): Pipeline<TNewResult, TOriginal> {
    const otherMiddleware = (x as any)._middleware ? (x as any)._middleware : [x];

    return Pipeline.of<TNewResult, TOriginal>([...this._middleware, ...otherMiddleware]);
  }

  /**
   * Create a Pipeline that will yield `pipeline.process` argument.
   * @returns {Pipeline<T>}
   */
  public empty(): Pipeline<any, any> {
    return Pipeline.of([Middleware.of((x) => x)]);
  }

  /**
   * Apply provided function creating a new Pipeline.
   * @param {(e: TContext) => TNewResult} f
   * @returns {Pipeline<TNewResult>}
   */
  public map<TNewResult>(f: (e: TContext) => TNewResult): Pipeline<TNewResult, TOriginal> {
    return Pipeline.of<TNewResult, TOriginal>([...this._middleware, Middleware.of(f)] as any);
  }

  /**
   * Process current Pipeline.
   * @param {TOriginal} ctx
   * @returns {Promise<TOriginal>}
   */
  public async process(ctx: TOriginal): Promise<TOriginal> {
    let innerCtx = ctx;

    while (this._index <= this._middleware.length - 1) {
      const result = this.next();
      const newCtx: any = await result.value.process(innerCtx as any);

      if (newCtx) {
        innerCtx = newCtx;
      }

      if (result.done) {
        return innerCtx as any;
      }
    }
  }

  /**
   * @inheritDoc
   * @param value
   * @returns {IteratorResult<MiddlewareInterface<TContext>>}
   */
  public next(value?: any): IteratorResult<MiddlewareInterface<TContext>> {
    return {
      done: this._index === this._middleware.length - 1,
      value: this._middleware[this._index++],
    };
  }

  /**
   * @inheritDoc
   * @returns {IterableIterator<MiddlewareInterface<TContext>>}
   */
  public [Symbol.iterator](): IterableIterator<MiddlewareInterface<TContext>> {
    return this;
  }
}
