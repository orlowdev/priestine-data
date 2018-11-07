import { MiddlewareInterface } from './interfaces';
import { MiddlewareFunctionInterface } from './interfaces';
import { Middleware } from './middleware';

/**
 * Pipeline represents linear execution of a set of Promise-based middleware. Pipeline and middleware can be used
 * interchangeably. Any extension of Middleware logic will produce creation of a Pipeline. Execution of the middleware
 * inside the Pipeline does not get triggered until you use the `pipeline.process` method. After the method finishes
 * executing middleware, it will return a regular Promise holding the final value which you cou can `.then` or `.catch`.
 * @class Pipeline
 */
export class Pipeline<TContext>
  implements MiddlewareInterface<TContext>, IterableIterator<MiddlewareInterface<TContext>> {
  /**
   * Lift an array of functions into Pipeline.
   * @param {Array<MiddlewareFunctionInterface<T>>} middleware
   * @returns {Pipeline<T>}
   */
  public static from<T>(middleware: Array<MiddlewareFunctionInterface<T>>): Pipeline<T> {
    return new Pipeline<T>(middleware.map(Middleware.of));
  }

  /**
   * Lift an array of Middleware into Pipeline.
   * @param {Array<MiddlewareInterface<T>>} middleware
   * @returns {Pipeline<T>}
   */
  public static of<T>(middleware: Array<MiddlewareInterface<T>>): Pipeline<T> {
    return new Pipeline<T>(middleware);
  }

  /**
   * Create a Pipeline that will yield `pipeline.process` argument.
   * @returns {Pipeline<T>}
   */
  public static empty<T>(): Pipeline<T> {
    return Pipeline.from([]);
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
  public concat(x: MiddlewareInterface<TContext>) {
    const otherMiddleware = (x as any)._middleware ? (x as any)._middleware : [x];

    return Pipeline.of([...this._middleware, ...otherMiddleware]);
  }

  /**
   * Process current Pipeline.
   * @param {TContext} ctx
   * @returns {Promise<TNewResult>}
   */
  public async process<TNewResult>(ctx: TContext): Promise<TNewResult> {
    let innerCtx = ctx;

    while (this._index <= this._middleware.length - 1) {
      const result = this.next();
      const newCtx: any = await result.value.process(innerCtx);

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
