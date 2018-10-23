import { SetoidInterface } from './setoid.interface';

export interface OrdInterface<TValue> extends SetoidInterface<TValue> {
  /**
   * lte :: Ord a => a ~> a -> Boolean
   * @param {TOrd} x
   * @returns {boolean}
   */
  lte(x: OrdInterface<TValue>): boolean;
}
