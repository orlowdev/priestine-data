import { MiddlewareContextInterface } from '../interfaces';
import { isObject } from './is-object.guard';

/**
 * Check if argument is middleware context.
 *
 * @param x
 * @returns {x is MiddlewareContextInterface}
 */
export function isMiddlewareContext(x: any): x is MiddlewareContextInterface {
  return isObject(x) && 'intermediate' in x;
}
