import { ApplicativeInterface } from './applicative.interface';
import { ChainInterface } from './chain.interface';

export interface MonadInterface<TValue>
  extends ApplicativeInterface<TValue>,
    ChainInterface<TValue> {}
