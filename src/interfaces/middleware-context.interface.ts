/**
 * Middleware context descriptor. This context is to be provided as middleware function argument or class-based
 * middleware .process argument.
 *
 * @interface {MiddlewareContextInterface<TIntermediate = unknown>}
 */
export interface MiddlewareContextInterface<TIntermediate = {}> {
  intermediate: TIntermediate;
  error?: Error;
}
