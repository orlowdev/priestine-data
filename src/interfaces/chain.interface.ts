import { ApplyInterface } from './apply.interface';

export interface ChainInterface<TValue> extends ApplyInterface<TValue> {
  /**
   * chain :: Chain m => m a ~> (a -> m b) -> m b
   * @param {(x: TValue) => TNewValue} f
   * @returns {ChainInterface<TNewValue>}
   */
  chain<TNewValue>(f: (x: TValue) => ChainInterface<TNewValue>): ChainInterface<TNewValue>;
}
