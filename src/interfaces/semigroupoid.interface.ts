export interface SemigroupoidInterface<TValue> {
  /**
   * compose :: Semigroupoid c => c i j ~> c j k -> c i k
   * @param {TSemigroupoid} x
   * @returns {SemigroupoidInterface<TValue>}
   */
  compose(x: SemigroupoidInterface<TValue>): SemigroupoidInterface<TValue>;
}
