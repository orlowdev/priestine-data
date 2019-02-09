import { MiddlewareContext } from './middleware-context';
import { SyncPipeline } from './sync-pipeline';

describe('SyncPipeline', () => {
  describe('Iterator', () => {
    const mw1 = (x) => x.intermediate + 1;
    const mw2 = (x) => x.intermediate + 2;
    const mw3 = (x) => x.intermediate + 3;

    it('should consecutively run synchronous code', () => {
      expect(SyncPipeline.from<any, any>([mw1, mw2, mw3]).process(MiddlewareContext.of(1)).intermediate).toEqual(7);
    });

    it('should do nothing if array of Middleware is empty', () => {
      expect(SyncPipeline.from([]).process(MiddlewareContext.of(1)).intermediate).toEqual(1);
    });

    it('should work with ctx that does not extend MiddlewareContext', () => {
      expect(SyncPipeline.from<any, string>([(x) => x.toUpperCase(), (x) => x.toLowerCase()]).process('Test')).toEqual(
        'test'
      );
    });

    it('should tap if middleware did not return a value', () => {
      expect(
        SyncPipeline.from<any, string>([
          (x) => {
            x.toUpperCase();
          },
        ]).process('test')
      ).toEqual('test');
    });

    it('should throw error if ctx is MiddlewareContext and the pipeline errored', () => {
      try {
        SyncPipeline.of<string>((ctx) => ctx.intermediate.toUpperCase()).process(MiddlewareContext.of(1 as any));
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
      }
    });

    it('should throw error if ctx is not MiddlewareContext and the pipeline errored', () => {
      try {
        SyncPipeline.of<unknown, string>((ctx) => ctx.toUpperCase()).process(1 as any);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
      }
    });

    it('[Symbol.iterator]', () => {
      expect(SyncPipeline.empty()[Symbol.iterator]()).toBeInstanceOf(SyncPipeline);
    });
  });

  describe('Semigroup', () => {
    it('ASSOCIATIVITY a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))', () => {
      const a = SyncPipeline.of<number>({ process: (x) => x.intermediate + 1 });
      const b = SyncPipeline.from<number>([(x) => x.intermediate + 2]);
      const c = SyncPipeline.from<number>([(x) => x.intermediate + 3]);

      expect(
        a
          .concat(b)
          .concat(c)
          .process(MiddlewareContext.of(1))
      ).toEqual(a.concat(b.concat(c)).process(MiddlewareContext.of(1)));
    });
  });

  describe('Monoid', () => {
    it('RIGHT IDENTITY m.concat(M.empty()) is equivalent to m', () => {
      const m = SyncPipeline.from<string>([(x) => Number.parseInt(x.intermediate)]);
      expect(m.concat(SyncPipeline.empty()).process(MiddlewareContext.of('3'))).toEqual(
        m.process(MiddlewareContext.of('3'))
      );
    });

    it('LEFT IDENTITY M.empty().concat(m) is equivalent to m', () => {
      const m = SyncPipeline.from<string>([(x) => Number.parseInt(x.intermediate)]);
      expect(
        SyncPipeline.empty()
          .concat(m)
          .process(MiddlewareContext.of('3'))
      ).toEqual(m.process(MiddlewareContext.of('3')));
    });

    it('is same for instance and static methods', () => {
      expect(SyncPipeline.empty()).toEqual(SyncPipeline.empty().empty());
    });
  });

  describe('toArray', () => {
    it('should return internally stored middleware as array', () => {
      const arr = [(x) => x.intermediate + 2, (x) => x.intermediate + 3];

      expect(SyncPipeline.from(arr).toArray()).toEqual(arr);
    });
  });
});
