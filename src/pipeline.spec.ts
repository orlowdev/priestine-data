import { Middleware } from './middleware';
import { Pipeline } from './pipeline';
import { expect } from 'chai';
import { Right } from './right';

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

    describe('[Symbol.iterator]', () => {
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

      expect(await a.concat(Middleware.of((x) => x + 4)).process(1)).to.equal(
        await Pipeline.from<number>([(x) => x + 1, (x) => x + 4]).process(1)
      );

      expect(await a.concat(Middleware.of(((x) => {}) as any)).process(1)).to.equal(
        await Pipeline.from<number>([(x) => x + 1]).process(1)
      );
    });
  });
});
