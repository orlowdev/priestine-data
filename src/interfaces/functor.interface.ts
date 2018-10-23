export interface FunctorInterface<T> {
  /**
   * map :: Functor f => f a ~> (a -> b) -> f b
   * @param {(e: T) => TNewResult} f
   * @returns {FunctorInterface<TNewResult>}
   */
  map<TNewResult>(f: (e: T) => TNewResult): FunctorInterface<TNewResult>;
}
