export interface FilterableInterface<TValue> {
  /**
   * filter :: Filterable f => f a ~> (a -> Boolean) -> f a
   * @param {(x: any) => boolean} f
   * @returns {FilterableInterface<TValue>}
   */
  filter(f: (x: any) => boolean): FilterableInterface<TValue>;
}
