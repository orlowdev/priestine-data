import { ApplyInterface } from './apply.interface';

export interface ApplicativeInterface<TValue> extends ApplyInterface<TValue> {
  /**
   * of :: Applicative f => a -> f a
   * @param {TValue} x
   * @returns {ApplicativeInterface<TValue>}
   */
  of<TNewValue>(x: TNewValue): ApplicativeInterface<TNewValue>;
}