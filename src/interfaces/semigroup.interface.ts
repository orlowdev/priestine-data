export interface SemigroupInterface<TValue> {
  /**
   * concat :: Semigroup a => a ~> a -> a
   * @param {TSemigroup} x
   * @returns {SemigroupInterface<TValue>}
   */
  concat(x: SemigroupInterface<TValue>): SemigroupInterface<TValue>;
}
