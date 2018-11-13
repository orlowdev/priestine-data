import { Middleware } from './middleware';
import { Pipeline } from './pipeline';
import { expect } from 'chai';

describe('Pipeline', () => {
  describe('Iterator', () => {
    const mw1 = Middleware.of((ctx: number) => ctx + 1);
    const mw2 = Middleware.of((ctx: number) => ctx + 2);
    const mw3 = Middleware.of((ctx: number) => ctx + 3);
    const to = (x) => new Promise<number>((resolve) => setTimeout(() => resolve(x + 4), 1));
    const amw1 = Middleware.of((ctx: number) => to(ctx) as any);

    it('should consecutively run synchronous code', async () => {
      expect(await Pipeline.of([mw1, mw2, mw3]).process(1)).to.equal(7);
    });

    it('should consecutively run Promise-based code', async () => {
      expect(await Pipeline.of([amw1, mw1]).process(1)).to.equal(6);
      expect(await Pipeline.of([mw1, amw1]).process(1)).to.equal(6);
    });

    it('should do nothing if array of Middleware is empty', async () => {
      expect(await Pipeline.of([]).process(1)).to.equal(undefined);
    });

    it('[Symbol.iterator]', () => {
      expect(Pipeline.empty()[Symbol.iterator]()).to.be.instanceof(Pipeline);
    });
  });

  describe('Semigroup', () => {
    it('ASSOCIATIVITY a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))', async () => {
      const a = Pipeline.from([(x: number) => x + 1]);
      const b = Pipeline.from([(x: number) => x + 2]);
      const c = Pipeline.from([(x: number) => x + 3]);

      expect(
        await a
          .concat(b)
          .concat(c)
          .process(1)
      ).to.equal(await a.concat(b.concat(c)).process(1));

      expect(await a.concat(Middleware.of((x: number) => x + 4)).process(1)).to.equal(
        await Pipeline.from([(x: number) => x + 1, (x: number) => x + 4]).process(1)
      );

      expect(await a.concat(Middleware.of(((x) => {}) as any)).process(1)).to.equal(
        await Pipeline.from([(x: number) => x + 1]).process(1)
      );
    });
  });

  describe('Functor', () => {
    it('IDENTITY u.map(a => a) is equivalent to u', async () => {
      const u = Pipeline.from([(x) => x]);

      expect(await u.map((a) => a).process(1)).to.equal(1);
    });

    it('COMPOSITION u.map(x => f(g(x))) is equivalent to u.map(g).map(f)', async () => {
      const u = Pipeline.from([(x: number) => x + 1]);
      const f = (x) => x + 1;
      const g = (x) => x + 2;

      expect(await u.map((x) => f(g(x))).process(1)).to.equal(
        await u
          .map(g)
          .map(f)
          .process(1)
      );
    });
  });

  describe('Monoid', () => {
    it('RIGHT IDENTITY m.concat(M.empty()) is equivalent to m', async () => {
      const m = Pipeline.from([Number.parseInt]);
      expect(await m.concat(Pipeline.empty()).process('3')).to.equal(await m.process('3'));
    });

    it('LEFT IDENTITY M.empty().concat(m) is equivalent to m', async () => {
      const m = Pipeline.from([Number.parseInt]);
      expect(
        await Pipeline.empty()
          .concat(m)
          .process('3')
      ).to.equal(await m.process('3'));
    });

    it('is same for instance and static methods', async () => {
      expect(await Pipeline.empty().process('3')).to.equal(
        await Pipeline.empty()
          .empty()
          .process('3')
      );
    });
  });
});
