import { MiddlewareInterface } from '../interfaces';
import { isObject } from './is-object.guard';

/**
 * Check if argument is a middleware object.
 *
 * @param x
 * @returns {x is MiddlewareInterface}
 */
export function isMiddlewareObject(x: any): x is MiddlewareInterface {
  return isObject(x) && 'process' in x;
}
