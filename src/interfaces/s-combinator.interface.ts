/**
 * seq :: (z -> (a -> b)) -> (z -> a) -> z -> b
 */
export interface SCombinatorInterface<T> {
  (fs: Array<(...args: any[]) => any>): (v: T) => any;
}
