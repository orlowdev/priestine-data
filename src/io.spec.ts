import { expect } from 'chai';
import { IO } from './io';
import { Right } from './right';

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

  describe('Functor', () => {
    it('IDENTITY u.map(a => a) is equivalent to u', () => {
      const u = IO.of(1);

      expect(u.map((a) => a).run()).to.equal(u.run());
    });

    it('COMPOSITION u.map(x => f(g(x))) is equivalent to u.map(g).map(f)', () => {
      const u = IO.of(1);
      const f = (x) => x + 1;
      const g = (x) => x + 2;

      expect(u.map((x) => f(g(x))).run()).to.equal(
        u
          .map(g)
          .map(f)
          .run()
      );
    });
  });

  describe('Apply', () => {
    it('COMPOSITION v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a)', () => {
      const v = IO.of((f) => (x) => f(x));
      const u = IO.of((f) => (x) => f(x));
      const a = IO.of((x) => x);

      expect(v.ap(u.ap(a.map((f) => (g) => (x) => (f as any)((g as any)(x))))).toString()).to.equal(
        v
          .ap(u)
          .ap(a)
          .toString()
      );
    });
  });

  describe('Chain', () => {
    it('ASSOCIATIVITY m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g))', () => {
      const m = IO.of(1);
      const f = (x) => IO.of(x + 1);
      const g = (x) => IO.of(x + 2);

      expect(
        m
          .chain(f)
          .chain(g)
          .run()
      ).to.equal(m.chain((x) => f(x).chain(g)).run());
    });
  });

  describe('Monad', () => {
    it('LEFT IDENTITY M.of(a).chain(f) is equivalent to f(a)', () => {
      const a = 1;
      const f = (x) => IO.of(x + 1);
      expect(
        IO.of(1)
          .chain(f)
          .run()
      ).to.equal(f(a).run());
    });

    it('RIGHT IDENTITY m.chain(M.of) is equivalent to m', () => {
      const m = IO.of(1);

      expect(m.chain(IO.of).run()).to.equal(m.run());
    });
  });
});
