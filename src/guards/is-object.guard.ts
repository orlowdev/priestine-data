/**
 * Check if argument is an object.
 *
 * @param x
 * @returns {x is object}
 */
export function isObject(x: any): x is object {
  return typeof x === 'object';
}
