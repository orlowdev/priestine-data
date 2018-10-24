import { FunctorInterface } from './functor.interface';

export interface BifunctorInterface<T> extends FunctorInterface<T> {
  /**
   * bimap :: Bifunctor f => f a c ~> (a -> b, c -> d) -> f b d
   * @param {(e: T) => TNewResultA} f1
   * @param {(e: T) => TNewResultB} f2
   * @returns {BifunctorInterface<TNewResultA | TNewResultB>}
   */
  bimap<TNewResultA, TNewResultB>(
    f1: (e: T) => TNewResultA,
    f2: (e: T) => TNewResultB
  ): BifunctorInterface<TNewResultA | TNewResultB>;
}
