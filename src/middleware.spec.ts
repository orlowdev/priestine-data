import { expect } from 'chai';
import { Middleware } from './middleware';
import { Task } from './task';
import { Pipeline } from './pipeline';

describe('Middleware', () => {
  describe('Semigroup', () => {
    it('ASSOCIATIVITY a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))', async () => {
      const a = Middleware.of((x: number) => x + 1);
      const b = Middleware.of((x: number) => x + 2);
      const c = Middleware.of((x: number) => x + 3);

      expect(
        await a
          .concat(b)
          .concat(c)
          .process(1)
      ).to.equal(await a.concat(b.concat(c)).process(1));
    });
  });

  describe('Functor', () => {
    it('IDENTITY u.map(a => a) is equivalent to u', async () => {
      const u = Middleware.of((x) => x);

      expect(await u.map((a) => a).process(1)).to.equal(1);
    });

    it('COMPOSITION u.map(x => f(g(x))) is equivalent to u.map(g).map(f)', async () => {
      const u = Middleware.of((x: number) => x + 1);
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
      const m = Middleware.of(Number.parseInt);
      const n = m.empty();
      expect(await m.concat(Middleware.empty()).process('3')).to.equal(await m.process('3'));
      expect(await m.concat(n).process('3')).to.equal(await m.process('3'));
    });

    it('LEFT IDENTITY M.empty().concat(m) is equivalent to m', async () => {
      const m = Middleware.of(Number.parseInt);
      const n = m.empty();
      expect(
        await Middleware.empty()
          .concat(m)
          .process('3')
      ).to.equal(await m.process('3'));
      expect(await n.concat(m).process('3')).to.equal(await m.process('3'));
    });
  });

  describe('constructor', () => {
    it('should throw error if provided input is not a function', () => {
      expect(() => Middleware.of(1 as any)).to.throw('Middleware Usage: Function required!');
    });
  });
});
