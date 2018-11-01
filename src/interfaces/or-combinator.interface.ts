/**
 * alt :: (f1 -> a, f2 -> b) -> a | b
 */
export interface OrCombinatorInterface<T> {
  <TF1, TF2>(f1: (v: T) => TF1, f2: (v: T) => TF2): (v: T) => TF1 | TF2;
}
