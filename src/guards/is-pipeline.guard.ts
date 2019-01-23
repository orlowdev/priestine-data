import { PipelineInterface } from '../interfaces';
import { isObject } from './is-object.guard';

/**
 * Check if argument is a pipeline.
 *
 * @param x
 * @returns {x is PipelineInterface}
 */
export function isPipeline(x: any): x is PipelineInterface {
  return isObject(x) && 'process' in x && 'done' in x && 'isEmpty' in x && 'next' in x && 'concat' in x;
}
