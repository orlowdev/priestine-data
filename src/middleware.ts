import { MiddlewareInterface } from './interfaces';
import { MiddlewareFunctionInterface } from './interfaces';
import { Pipeline } from './pipeline';

export class Middleware<TContext> implements MiddlewareInterface<TContext> {
  public static of<TContext>(effect: MiddlewareFunctionInterface<TContext>): Middleware<TContext> {
    return new Middleware<TContext>(effect);
  }

  public constructor(readonly effect: MiddlewareFunctionInterface<TContext>) {
    if (typeof effect !== 'function') {
      throw new Error('Middleware Usage: Function required!');
    }
  }

  public process(ctx: TContext): Promise<TContext> {
    return Promise.resolve(this.effect(ctx));
  }

  public concat(x: MiddlewareInterface<TContext>) {
    return Pipeline.of([this, x]);
  }
}
