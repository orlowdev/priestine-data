export interface SetoidInterface<TValue> {
  /**
   * equals :: Setoid a => a ~> a -> Boolean
   * @param {SetoidInterface<TValue>} x
   * @returns {boolean}
   */
  equals(x: SetoidInterface<TValue>): boolean;
}
