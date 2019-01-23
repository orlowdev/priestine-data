import { MiddlewareContext } from './middleware-context';
import { Pipeline } from './pipeline';

describe('Pipeline', () => {
  describe('Iterator', () => {
    const mw1 = (x) => x.intermediate + 1;
    const mw2 = (x) => x.intermediate + 2;
    const mw3 = (x) => x.intermediate + 3;
    const amw1 = (x) =>
      new Promise((resolve) =>
        setTimeout(() => {
          x.intermediate = x.intermediate + 4;
          resolve();
        }, 1)
      );

    it('should consecutively run synchronous code', async () => {
      expect((await Pipeline.from<any, any>([mw1, mw2, mw3]).process(MiddlewareContext.of(1))).intermediate).toEqual(7);
    });

    it('should consecutively run Promise-based code', async () => {
      expect((await Pipeline.from([amw1, mw1]).process(MiddlewareContext.of(1))).intermediate).toEqual(6);
      expect((await Pipeline.from([mw1, amw1]).process(MiddlewareContext.of(1))).intermediate).toEqual(6);
    });

    it('should do nothing if array of Middleware is empty', async () => {
      expect((await Pipeline.from([]).process(MiddlewareContext.of(1))).intermediate).toEqual(1);
    });

    it('should work with ctx that does not extend MiddlewareContext', async () => {
      expect(
        await Pipeline.from<any, string>([(x) => x.toUpperCase(), (x) => x.toLowerCase()]).process('Test')
      ).toEqual('test');
    });

    it('should throw error if ctx is MiddlewareContext and the pipeline errored', async () => {
      try {
        await Pipeline.of<string>((ctx) => ctx.intermediate.toUpperCase()).process(MiddlewareContext.of(1 as any));
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
      }
    });

    it('should throw error if ctx is not MiddlewareContext and the pipeline errored', async () => {
      try {
        await Pipeline.of<unknown, string>((ctx) => ctx.toUpperCase()).process(1 as any);
      } catch (e) {
        expect(e).toBeInstanceOf(TypeError);
      }
    });

    it('[Symbol.iterator]', () => {
      expect(Pipeline.empty()[Symbol.iterator]()).toBeInstanceOf(Pipeline);
    });
  });

  describe('Semigroup', () => {
    it('ASSOCIATIVITY a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))', async () => {
      const a = Pipeline.of<number>({ process: (x) => x.intermediate + 1 });
      const b = Pipeline.from<number>([(x) => x.intermediate + 2]);
      const c = Pipeline.from<number>([(x) => x.intermediate + 3]);

      expect(
        await a
          .concat(b)
          .concat(c)
          .process(MiddlewareContext.of(1))
      ).toEqual(await a.concat(b.concat(c)).process(MiddlewareContext.of(1)));
    });
  });

  describe('Monoid', () => {
    it('RIGHT IDENTITY m.concat(M.empty()) is equivalent to m', async () => {
      const m = Pipeline.from<string>([(x) => Number.parseInt(x.intermediate)]);
      expect(await m.concat(Pipeline.empty()).process(MiddlewareContext.of('3'))).toEqual(
        await m.process(MiddlewareContext.of('3'))
      );
    });

    it('LEFT IDENTITY M.empty().concat(m) is equivalent to m', async () => {
      const m = Pipeline.from<string>([(x) => Number.parseInt(x.intermediate)]);
      expect(
        await Pipeline.empty()
          .concat(m)
          .process(MiddlewareContext.of('3'))
      ).toEqual(await m.process(MiddlewareContext.of('3')));
    });

    it('is same for instance and static methods', async () => {
      expect(Pipeline.empty()).toEqual(Pipeline.empty().empty());
    });
  });

  describe('toArray', () => {
    it('should return internally stored middleware as array', () => {
      const arr = [(x) => x.intermediate + 2, (x) => x.intermediate + 3];

      expect(Pipeline.from(arr).toArray()).toEqual(arr);
    });
  });
});
