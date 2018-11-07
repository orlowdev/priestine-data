import { expect } from 'chai';
import { Middleware } from './middleware';

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

  describe('constructor', () => {
    it('should throw error if provided input is not a function', () => {
      expect(() => Middleware.of(1 as any)).to.throw('Middleware Usage: Function required!');
    });
  });
});
