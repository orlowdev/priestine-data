import { FunctorInterface } from './functor.interface';

export interface ApplyInterface<TValue> extends FunctorInterface<TValue> {
  /**
   * ap :: Apply f => f a ~> f (a -> b) -> f b
   * @returns {ApplyInterface<TAnotherValue>}
   * @param v
   */
  ap<TAnotherValue, TNewValue>(
    v: ApplyInterface<TAnotherValue>
  ): ApplyInterface<TNewValue>;
}
