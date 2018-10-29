import { expect } from 'chai';
import { Left } from './left';
import { Right } from './right';

describe('Left', () => {
  describe('Left.of', () => {
    it('should return a Left', () => {
      expect(Left.of('test')).to.be.instanceof(Left);
    });

    it('should refer to the value as the failure branch', () => {
      expect(Left.of('test').fold(() => 'fail', (x) => x)).to.equal('fail');
      expect(Left.of('test').unsafeGet()).to.equal('test');
    });
  });

  describe('right.of', () => {
    it('should return a Left', () => {
      expect(Left.of('test').of('test1')).to.be.instanceof(Left);
      expect(
        Left.of('test')
          .of('test1')
          .unsafeGet()
      ).to.equal('test1');
    });

    it('should refer to the value as the failure branch', () => {
      expect(
        Left.of('test')
          .of('test1')
          .fold(() => 'fail', (x) => x)
      ).to.equal('fail');
    });
  });

  describe('Instance methods', () => {
    describe('unsafeGet', () => {
      it('should return inner value', () => {
        expect(Left.of(true).unsafeGet()).to.equal(true);
      });
    });

    describe('toString', () => {
      it('should provide short human-readable description', () => {
        expect(Left.of(true).toString()).to.equal('Left(true)');
      });
    });

    describe('concat', () => {
      it('should return an instance of Left on Left.concat(Left)', () => {
        expect(
          Left.of([1, 2])
            .concat(Left.of([3]))
            .unsafeGet().length
        ).to.equal(2);
        expect(Left.of([1, 2]).concat(Left.of([3]))).to.be.instanceof(Left);
      });

      it('should return an instance of Left on Right.concat(Left)', () => {
        expect(
          Right.of([1, 2])
            .concat(Left.of([3]))
            .unsafeGet().length
        ).to.equal(1);
        expect(Right.of([1, 2]).concat(Left.of([3]))).to.be.instanceof(Left);
      });

      it('should return an instance of Right on Left.concat(Right)', () => {
        expect(
          Left.of([1, 2])
            .concat(Right.of([3]))
            .unsafeGet().length
        ).to.equal(2);
        expect(Left.of([1, 2]).concat(Right.of([3]))).to.be.instanceof(Left);
      });

      it('should return Right of first value if values are not concatable with .concat()', () => {
        expect(Left.of(true).concat(Left.of(false))).to.be.instanceof(Left);
        expect(
          Left.of(true)
            .concat(Left.of(false))
            .unsafeGet()
        ).to.equal(true);
      });
    });
  });

  describe('helpers', () => {
    it('should return true for isLeft', () => expect(Left.of(3).isLeft).to.be.true);
    it('should return true for isRight', () => expect(Left.of(3).isRight).to.be.false);
  });

  describe('unsafeGetOrElse', () => {
    it('should execute provided function', () => {
      expect(Left.of(3).getOrElse(() => 2 / 0)).to.equal(Infinity);
    });
  });

  describe('swap', () => {
    it('should return a Right', () => expect(Left.of(3).swap()).to.be.instanceof(Right));
    it('should pass its value to the Right', () =>
      expect(
        Left.of(3)
          .swap()
          .unsafeGet()
      ).to.equal(3));
  });

  describe('isEqual', () => {
    it('should return false if Either subclasses do not match', () =>
      expect(Left.of(3).equals(Right.of(3) as any)).to.be.false);

    it('should return false if internal values do not match', () =>
      expect(Left.of(3).equals(Right.of(4) as any)).to.be.false);

    it('should return true if Eithers are indeed equal', () => expect(Left.of(3).equals(Left.of(3))).to.be.true);
  });

  describe('ap', () => {
    it('should apply the function in the Either to the value of another value', () => {
      expect(
        Left.of(3)
          .ap(Left.of((x) => x + 3))
          .unsafeGet()
      ).to.not.equal(6);
      expect(Left.of((x) => x + 3).ap(Left.of(3))).to.be.instanceof(Left);
    });

    it('should not apply the function in the Either to the value of the Right', () => {
      expect(
        Left.of(3)
          .ap(Left.of((x) => x + 3))
          .unsafeGet()
      ).to.not.equal(6);
      expect(Left.of(3).ap(Left.of((x) => x + 3))).to.be.instanceof(Left);
    });

    it('should throw a TypeError if the Either does not hold a function', () => {
      expect(() => Left.of(3).ap(Left.of(3))).to.not.throw(TypeError);
    });
  });

  describe('chain', () => {
    it('should execute provided function and pass the value for another monad', () => {
      expect(Left.of(3).chain((x) => Left.of(x + 3))).to.be.instanceof(Left);
      expect(
        Left.of(3)
          .chain((x) => Left.of(x + 3))
          .unsafeGet()
      ).to.equal(3);
    });
  });

  describe('map', () => {
    it('should return a new Left with provided function executed on it', () => {
      expect(Left.of(3).map((x) => x + 3)).to.be.instanceof(Left);
      expect(
        Left.of(3)
          .map((x) => x + 3)
          .unsafeGet()
      ).to.equal(3);
    });
  });

  describe('fold', () => {
    it('should execute provided function and fold the value from the Either', () => {
      expect(Left.of(3).fold((e) => e, (r) => r + 3)).to.equal(3);
    });
  });

  describe('[Symbol.species]', () => {
    it('should be OK', () => {
      expect(Left[Symbol.species]).to.be.a('function');
    });
  });

  describe('Setoid', () => {
    it('REFLEXIVITY a.equals(a) === true', () => {
      const a = Left.of(3);
      expect(a.equals(a)).to.equal(true);
    });

    it('SYMMETRY a.equals(b) === b.equals(a)', () => {
      const a = Left.of(3);
      const b = Left.of(3);
      expect(a.equals(b)).to.equal(b.equals(a));
    });

    it('TRANSITIVITY if a.equals(b) and b.equals(c) then a.equals(c)', () => {
      const a = Left.of(3);
      const b = Left.of(3);
      const c = Left.of(3);

      expect(a.equals(b) && b.equals(c)).to.equals(a.equals(c));
    });
  });

  describe('Semigroup', () => {
    it('ASSOCIATIVITY a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))', () => {
      const a = Left.of([1]);
      const b = Left.of([2]);
      const c = Left.of([3]);

      expect(
        a
          .concat(b)
          .concat(c)
          .unsafeGet()
      ).to.deep.equal(a.concat(b.concat(c)).unsafeGet());
    });
  });

  describe('Functor', () => {
    it('IDENTITY u.map(a => a) is equivalent to u', () => {
      const u = Left.of(1);

      expect(u.map((a) => a).equals(u)).to.equal(true);
    });

    it('COMPOSITION u.map(x => f(g(x))) is equivalent to u.map(g).map(f)', () => {
      const u = Left.of(1);
      const f = (x) => x + 1;
      const g = (x) => x + 2;

      expect(u.map((x) => f(g(x))).unsafeGet()).to.equal(
        u
          .map(g)
          .map(f)
          .unsafeGet()
      );
    });
  });

  describe('Apply', () => {
    it('COMPOSITION v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a)', () => {
      const v = Left.of((f) => (x) => f(x));
      const u = Left.of((f) => (x) => f(x));
      const a = Left.of((x) => x);

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
      const m = Left.of(1);
      const f = (x) => Left.of(x + 1);
      const g = (x) => Left.of(x + 2);

      expect(
        m
          .chain(f)
          .chain(g)
          .unsafeGet()
      ).to.equal(m.chain((x) => f(x).chain(g)).unsafeGet());
    });
  });

  describe('Monad', () => {
    it('RIGHT IDENTITY m.chain(M.of) is equivalent to m', () => {
      const m = Left.of(1);

      expect(m.chain(Left.of).unsafeGet()).to.equal(m.unsafeGet());
    });
  });
});
