/**
 * tap :: (a -> *) -> a -> a
 */
export interface KCombinatorInterface<T> {
  (f: (x: T) => any): (x: T) => T;
}
