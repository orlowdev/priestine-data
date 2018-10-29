import { expect } from 'chai';
import { Left } from './left';
import { Right } from './right';

describe('Right', () => {
  describe('Right.of', () => {
    it('should return a Right', () => {
      expect(Right.of('test')).to.be.instanceof(Right);
    });

    it('should refer to the value as the successful branch', () => {
      expect(Right.of('test').fold(() => 'fail', (x) => x)).to.equal('test');
    });

    const v = Right.of(1);
  });

  describe('right.of', () => {
    it('should return a Right', () => {
      expect(Right.of('test').of('test1')).to.be.instanceof(Right);
    });

    it('should refer to the value as the successful branch', () => {
      expect(
        Right.of('test')
          .of('test1')
          .fold(() => 'fail', (x) => x)
      ).to.equal('test1');
    });
  });

  describe('Instance methods', () => {
    describe('unsafeGet', () => {
      it('should return inner value', () => {
        expect(Right.of(true).unsafeGet()).to.equal(true);
      });
    });

    describe('toString', () => {
      it('should provide short human-readable description', () => {
        expect(Right.of(true).toString()).to.equal('Right(true)');
      });
    });

    describe('concat', () => {
      it('should return an instance of Right on Right.concat(Right)', () => {
        expect(
          Right.of([1, 2])
            .concat(Right.of([3]))
            .unsafeGet().length
        ).to.equal(3);
        expect(Right.of([1, 2]).concat(Right.of([3]))).to.be.instanceof(Right);
      });

      it('should return an instance of Left on Left.concat(Right)', () => {
        expect(
          Left.of([1, 2])
            .concat(Right.of([3]))
            .unsafeGet().length
        ).to.equal(2);
        expect(Left.of([1, 2]).concat(Right.of([3]))).to.be.instanceof(Left);
      });

      it('should return an instance of Left on Right.concat(Left)', () => {
        expect(
          Right.of([1, 2])
            .concat(Left.of([3]))
            .unsafeGet().length
        ).to.equal(1);
        expect(Right.of([1, 2]).concat(Left.of([3]))).to.be.instanceof(Left);
      });

      it('should return an instance of Left on Left.concat(Left)', () => {
        expect(
          Left.of([1, 2])
            .concat(Left.of([3]))
            .unsafeGet().length
        ).to.equal(2);
        expect(Left.of([1, 2]).concat(Left.of([3]))).to.be.instanceof(Left);
      });

      it('should throw TypeError if values are not concatable with .concat', () => {
        expect(() => Right.of(true).concat(Right.of(false))).to.throw(TypeError);
      });
    });
  });

  describe('helpers', () => {
    it('should return true for isRight', () => expect(Right.of(3).isRight).to.be.true);
    it('should return true for isLeft', () => expect(Right.of(3).isLeft).to.be.false);
  });

  describe('getOrElse', () => {
    it('should return the internal value', () => {
      expect(Right.of(3).getOrElse(() => 2 / 0)).to.equal(3);
    });
  });

  describe('swap', () => {
    it('should return a Left', () => expect(Right.of(3).swap()).to.be.instanceof(Left));
    it('should pass its value to the Left', () =>
      expect(
        Right.of(3)
          .swap()
          .unsafeGet()
      ).to.equal(3));
  });

  describe('equals', () => {
    it('should return false if Either subclasses do not match', () =>
      expect(Right.of(3).equals(Left.of(3) as any)).to.be.false);

    it('should return false if internal values do not match', () =>
      expect(Right.of(3).equals(Left.of(4) as any)).to.be.false);

    it('should return true if Eithers are indeed equal', () => expect(Right.of(3).equals(Right.of(3))).to.be.true);
  });

  describe('ap', () => {
    it('should apply the function in the Either to the value of another value', () => {
      expect(
        Right.of(3)
          .ap(Right.of((x) => x + 3))
          .unsafeGet()
      ).to.equal(6);
      expect(Right.of(3).ap(Right.of((x) => x + 3))).to.be.instanceof(Right);
    });

    it('should not apply the function in the Either to the value of the Left', () => {
      expect(
        Right.of((x) => x + 3)
          .ap(Left.of(3) as any)
          .unsafeGet()
      ).to.equal(3);
      expect(Right.of((x) => x + 3).ap(Left.of(3) as any)).to.be.instanceof(Left);
    });

    it('should throw a TypeError if the Either does not hold a function', () => {
      expect(() => Right.of(3).ap(Right.of(3))).to.throw(TypeError);
    });
  });

  describe('chain', () => {
    it('should execute provided function and pass the value for another monad', () => {
      expect(
        Right.of(3)
          .chain((x) => Right.of(x + 3))
          .unsafeGet()
      ).to.equal(6);
    });
  });

  describe('map', () => {
    it('should return a new Right with provided function executed on it', () => {
      expect(Right.of(3).map((x) => x + 3)).to.be.instanceof(Right);
      expect(
        Right.of(3)
          .map((x) => x + 3)
          .unsafeGet()
      ).to.equal(6);
    });
  });

  describe('fold', () => {
    it('should execute provided function and fold the value from the Either', () => {
      expect(Right.of(3).fold(() => {}, (r) => r)).to.equal(3);
    });
  });

  describe('right.toString', () => {
    it('should return string representation of the Right', () => {
      expect(Right.of('test').toString()).to.equal('Right(test)');
    });
  });

  describe('[Symbol.species]', () => {
    it('should be OK', () => {
      expect(Right[Symbol.species]).to.be.a('function');
    });
  });

  describe('Setoid', () => {
    it('REFLEXIVITY a.equals(a) === true', () => {
      const a = Right.of(3);
      expect(a.equals(a)).to.equal(true);
    });

    it('SYMMETRY a.equals(b) === b.equals(a)', () => {
      const a = Right.of(3);
      const b = Right.of(3);
      expect(a.equals(b)).to.equal(b.equals(a));
    });

    it('TRANSITIVITY if a.equals(b) and b.equals(c) then a.equals(c)', () => {
      const a = Right.of(3);
      const b = Right.of(3);
      const c = Right.of(3);

      expect(a.equals(b) && b.equals(c)).to.equals(a.equals(c));
    });
  });

  describe('Semigroup', () => {
    it('ASSOCIATIVITY a.concat(b).concat(c) is equivalent to a.concat(b.concat(c))', () => {
      const a = Right.of([1]);
      const b = Right.of([2]);
      const c = Right.of([3]);

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
      const u = Right.of(1);

      expect(u.map((a) => a).equals(u)).to.equal(true);
    });

    it('COMPOSITION u.map(x => f(g(x))) is equivalent to u.map(g).map(f)', () => {
      const u = Right.of(1);
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
      const v = Right.of((f) => (x) => f(x));
      const u = Right.of((f) => (x) => f(x));
      const a = Right.of((x) => x);

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
      const m = Right.of(1);
      const f = (x) => Right.of(x + 1);
      const g = (x) => Right.of(x + 2);

      expect(
        m
          .chain(f)
          .chain(g)
          .unsafeGet()
      ).to.equal(m.chain((x) => f(x).chain(g)).unsafeGet());
    });
  });

  describe('Monad', () => {
    it('LEFT IDENTITY M.of(a).chain(f) is equivalent to f(a)', () => {
      const a = 1;
      const f = (x) => Right.of(x + 1);
      expect(
        Right.of(1)
          .chain(f)
          .unsafeGet()
      ).to.equal(f(a).unsafeGet());
    });

    it('RIGHT IDENTITY m.chain(M.of) is equivalent to m', () => {
      const m = Right.of(1);

      expect(m.chain(Right.of).unsafeGet()).to.equal(m.unsafeGet());
    });
  });
});
