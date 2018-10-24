import { expect } from 'chai';
import { IO } from './io';

describe('IO', () => {
  describe('IO.of', () => {
    it('should return an IO', () => {
      expect(IO.of('test')).to.be.instanceof(IO);
    });

    it('should transform provided input into a function', () => {
      expect(IO.of('test').run()).to.equal('test');
    });
  });

  describe('IO.from', () => {
    it('should return an IO', () => {
      expect(IO.from(() => 'test')).to.be.instanceof(IO);
    });

    it('should throw if provided input is not a function', () => {
      expect(() => IO.from('hello' as any)).to.throw(/IO Usage/);
    });
  });

  describe('io.run', () => {
    it('should run the effect', () => {
      expect(IO.of('test').run()).to.equal('test');
    });
  });

  describe('io.of', () => {
    it('should return an IO', () => {
      expect(IO.of('Test').of('test')).to.be.instanceof(IO);
    });

    it('should return a new IO', () => {
      expect(
        IO.of('test')
          .of(1)
          .run()
      ).to.equal(1);
      expect(IO.of('test').run()).to.equal('test');
    });

    it('IDENTITY: v.ap(A.of((x) => x) is equivalent to v', () => {
      const v = IO.of(1);
      expect(v.ap(IO.of((x) => x)).run()).to.equal(v.run());
    });
  });

  describe('io.map', () => {
    it('should return an IO', () => {
      expect(IO.of('Test').map(() => 'test')).to.be.instanceof(IO);
    });

    it('should throw if provided input is not a function', () => {
      expect(() => IO.of('Test').map('test' as any)).to.throw(TypeError);
    });

    it('should apply mapping on the IO', () => {
      expect(
        IO.of('test')
          .map((x) => x + 1)
          .run()
      ).to.equal('test1');
    });

    it('IDENTITY: x.map((y) => y) is equivalent to x', () => {
      expect(
        IO.of('test')
          .map((x) => x)
          .run()
      ).to.equal(IO.of('test').run());
    });

    it('COMPOSITION: x.map((y) => f(g(y))) is equivalent to x.map(g).map(f)', () => {
      const f = (x) => x + 1;
      const g = (x) => x + 2;
      expect(
        IO.of('test')
          .map((x) => f(g(x)))
          .run()
      ).to.equal(
        IO.of('test')
          .map(g)
          .map(f)
          .run()
      );
    });
  });

  describe('io.ap', () => {
    it('should apply given IO contents to current curried IO effect', () => {
      expect(
        IO.from((x) => x + 1)
          .ap(IO.of('test'))
          .run()
      ).to.equal('test1');
    });

    it('COMPOSITION: v.ap(u.ap(a.map((f) => (g) = (x) => f(g(x))))) is equivalent to v.ap(u).ap(a)', () => {
      const v = IO.of('v');
      const u = IO.of('u');
      const a = IO.of('a');

      expect(v.ap(u.ap(a.map((f: any) => (g) => (x) => f(g(x))))).run()).to.equal(
        v
          .ap(u)
          .ap(a)
          .run()
      );
    });
  });

  describe('io.chain', () => {
    it('should chain another IO', () => {
      expect(
        IO.from(() => 'test')
          .chain((x) => IO.from(() => x + 1))
          .run()
      ).to.equal('test1');
    });
  });

  describe('io.toString', () => {
    it('should return proper tagname', () => {
      expect(IO.of('').toString()).to.equal('[object IO]');
    });
  });
});
