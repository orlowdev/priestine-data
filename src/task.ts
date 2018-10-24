import { BifunctorInterface } from './interfaces/bifunctor.interface';
import { MonadInterface } from './interfaces/monad.interface';
import { MonoidInterface } from './interfaces/monoid.interface';

/**
 * A helper for delaying the execution of a function.
 * @type {(callback: Function, ...args: any[]) => void}
 */
const delayed: (cb: Function, ...args: any[]) => void =
  typeof setImmediate !== 'undefined' ? setImmediate : typeof process !== 'undefined' ? process.nextTick : setTimeout;

/**
 * @class Task
 */
export class Task<T> implements MonoidInterface<T>, MonadInterface<T>, BifunctorInterface<T> {
  /**
   * Create a Task that will never resolve.
   * @returns {Task<() => TResult>}
   */
  public static empty<TResult>(): Task<() => TResult> {
    return new Task((() => {}) as () => any);
  }

  /**
   * Create a new `Task[a, b]` containing the single value `b`.
   * @param {TNewResult} x
   * @returns {Task<TNewResult>}
   */
  public static of<TNewResult>(x: TNewResult): Task<TNewResult> {
    return new Task((_, resolve) => resolve(x));
  }

  /**
   * Create a new `Task[a, b]` containing the single value `b`.
   * @param {TNewResult} x
   * @returns {Task<TNewResult>}
   */
  public static rejected<TNewResult>(x: TNewResult): Task<TNewResult> {
    return new Task((reject) => reject(x));
  }

  public readonly fork: <TForkResolve extends Function, TForkReject extends Function, TNewResult>(
    reject: TForkReject,
    resolve: TForkResolve
  ) => TNewResult;
  public readonly cleanup: (...args) => any;

  /**
   * @constructor
   * @param {<TForkResolve extends Function, TForkReject extends Function, TForkResult extends any>(reject:
   *   TForkReject, resolve?: TForkResolve) => TForkResult} fork
   * @param {<TCleanupResult>(...args: any[]) => TCleanupResult} cleanup
   */
  public constructor(
    fork: <TForkResolve extends Function, TForkReject extends Function>(
      reject: TForkReject,
      resolve?: TForkResolve
    ) => any,
    cleanup?: <TCleanupResult>(...args: any[]) => TCleanupResult
  ) {
    this.fork = fork;
    this.cleanup = cleanup || (() => {});
  }

  /**
   * Apply the successful value of the `Task[a, (b -> y)]` to the successful value of the `Task[a, b]`.
   * @param {Task<TNewArg>} x
   * @returns {Task<TNewResult>}
   */
  public ap<TNewArg, TNewResult>(x: Task<TNewArg>): Task<TNewResult> {
    const thisFork = this.fork;

    const cleanupBoth: any = (s) => {
      this.cleanup(s[0]);
      x.cleanup(s[1]);
    };

    return new Task((reject, resolve) => {
      let func;
      let funcLoaded = false;
      let val;
      let valLoaded = false;
      let rejected = false;
      let allState;

      const guardResolve = (setter) => (v) => {
        if (rejected) {
          return;
        }

        setter(v);

        if (funcLoaded && valLoaded) {
          delayed(() => cleanupBoth(allState));
          return resolve(func(val));
        } else {
          return v;
        }
      };

      const guardReject = (v) => {
        if (rejected) {
          return;
        }

        rejected = true;
        return reject(v);
      };

      const thisState = thisFork(
        guardReject,
        guardResolve((f) => {
          funcLoaded = true;
          func = f;
        })
      );

      const thatState = x.fork(
        guardReject,
        guardResolve((v) => {
          valLoaded = true;
          val = v;
        })
      );

      return (allState = [thisState, thatState]);
    }, cleanupBoth);
  }

  /**
   * Transform the successful value of the `Task[a, b]` using a function to a monad.
   * @param {(x: TNewArg) => Task<TNewResult>} f
   * @returns {Task<TNewResult>}
   */
  public chain<TNewResult>(f: (x: T) => Task<TNewResult>): Task<TNewResult> {
    const thisFork = this.fork;

    return new Task((reject, resolve) => thisFork((a) => reject(a), (b) => f(b).fork(reject, resolve)), this.cleanup);
  }

  /**
   * Transform the successful value of the `Task[a, b]` using a regular unary function.
   * @param {(e: T) => TNewResult} f
   * @returns {Task<TNewResult>}
   */
  public map<TNewResult>(f: (e: T) => TNewResult): Task<TNewResult> {
    const thisFork = this.fork;

    return new Task((reject, resolve) => thisFork((x) => reject(x), (y) => resolve(f(y))), this.cleanup);
  }

  /**
   * Create a new `Task[a, b]` containing the single value `b`.
   * @param {TNewArg} x
   * @returns {Task<TNewArg>}
   */
  public of<TNewArg>(x: TNewArg): Task<TNewArg> {
    return Task.of(x);
  }

  /**
   * Select the earlier of the two Tasks.
   * @param {Task<TNewArg>} x
   * @returns {Task<TNewResult>}
   */
  public concat<
    TNewArg,
    TNewResult,
    TForkResolve extends Function,
    TForkReject extends Function,
    TForkResult extends any
  >(x: Task<TNewArg>): Task<TNewResult> {
    const thisFork = this.fork;
    const thisCleanup = this.cleanup;

    const cleanupBoth: any = (s) => {
      thisCleanup(s[0]);
      x.cleanup(s[1]);
    };

    return new Task((reject, resolve) => {
      let done: boolean = false;
      let allState;

      const guard = (f) => (y) => {
        if (!done) {
          done = true;
          delayed(() => cleanupBoth(allState));
          return f(y);
        }
      };

      const cState = thisFork(guard(reject), guard(resolve));
      const xState = x.fork(guard(reject), guard(resolve));

      return (allState = [cState, xState]);
    }, cleanupBoth);
  }

  /**
   * Map both sides of the disjunction.
   * @param {(e: T) => TNewResultA} f
   * @param {(e: T) => TNewResultB} g
   * @returns {Task<TNewResultA | TNewResultB>}
   */
  public bimap<TNewResultA, TNewResultB>(
    f: (e: T) => TNewResultA,
    g: (e: T) => TNewResultB
  ): Task<TNewResultA | TNewResultB> {
    const thisFork = this.fork;

    return new Task((reject, resolve) => thisFork((a) => reject(f(a)), (b) => resolve(g(b))), this.cleanup);
  }

  /**
   * Take two functions and apply the leftmost one to the failure value and the rightmost one to the successful
   * value, depending on which one is present.
   * @param {TForkReject} f
   * @param {TForkResolve} g
   * @returns {any}
   */
  public fold<TForkResolve extends Function, TForkReject extends Function, TForkResult extends any>(
    f: TForkReject,
    g?: TForkResolve
  ): any {
    const thisFork = this.fork;

    return new Task((reject, resolve) => thisFork((a) => resolve(f(a)), (b) => resolve(g(b))), this.cleanup);
  }

  /**
   * Map the left side of the disjunction (failure).
   * @param {(e: T) => TNewResult} f
   * @returns {Task<TNewResult>}
   */
  public rejectedMap<TNewResult>(f: (e: T) => TNewResult): Task<TNewResult> {
    const thisFork = this.fork;

    return new Task((reject, resolve) => thisFork((a) => reject(f(a)), (b) => resolve(b)), this.cleanup);
  }

  /**
   * Swap the disjunction values.
   * @returns {Task<T>}
   */
  public swap(): Task<T> {
    const thisFork = this.fork;
    return new Task((reject, resolve) => thisFork((a) => resolve(a), (b) => reject(b)), this.cleanup);
  }

  /**
   * Transform a failure value into a new `Task[a, b]`. Does nothing if the structure already contains a successful
   * value.
   * @param {(x: TNewArg) => Task<TNewResult>} f
   * @returns {Task<TNewResult>}
   */
  public orElse<TNewArg, TNewResult>(f: (x: T) => Task<TNewResult>): Task<TNewResult> {
    const thisFork = this.fork;

    return new Task((reject, resolve) => thisFork((a) => f(a).fork(reject, resolve), (b) => resolve(b)), this.cleanup);
  }

  /**
   * Create a Task that will never resolve.
   * @returns {Task<() => TResult>}
   */
  public empty(): Task<() => void> {
    return Task.empty();
  }

  /**
   * Create a new `Task[a, b]` containing the single value `b`.
   * @param {TNewArg} x
   * @returns {Task<TNewArg>}
   */
  public rejected<TNewArg>(x: TNewArg): Task<TNewArg> {
    return Task.rejected(x);
  }

  public get [Symbol.toStringTag]() {
    return 'Task';
  }
}
