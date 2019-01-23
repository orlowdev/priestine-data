import { Left } from './left';
import { Right } from './right';

describe('Right', () => {
  describe('Right.of', () => {
    it('should return a Right', () => {
      expect(Right.of('test')).toBeInstanceOf(Right);
    });

    it('should refer to the value as the successful branch', () => {
      expect(Right.of('test').fold(() => 'fail', (x) => x)).toEqual('test');
    });

    const v = Right.of(1);
  });

  describe('right.of', () => {
    it('should return a Right', () => {
      expect(Right.of('test').of('test1')).toBeInstanceOf(Right);
    });

    it('should refer to the value as the successful branch', () => {
      expect(
        Right.of('test')
          .of('test1')
          .fold(() => 'fail', (x) => x)
      ).toEqual('test1');
    });
  });

  describe('Instance methods', () => {
    describe('unsafeGet', () => {
      it('should return inner value', () => {
        expect(Right.of(true).unsafeGet()).toEqual(true);
      });
    });

    describe('toString', () => {
      it('should provide short human-readable description', () => {
        expect(Right.of(true).toString()).toEqual('Right(true)');
      });
    });

    describe('concat', () => {
      it('should return an instance of Right on Right.concat(Right)', () => {
        expect(
          Right.of([1, 2])
            .concat(Right.of([3]))
            .unsafeGet().length
        ).toEqual(3);
        expect(Right.of([1, 2]).concat(Right.of([3]))).toBeInstanceOf(Right);
      });

      it('should return an instance of Left on Left.concat(Right)', () => {
        expect(
          Left.of([1, 2])
            .concat(Right.of([3]))
            .unsafeGet().length
        ).toEqual(2);
        expect(Left.of([1, 2]).concat(Right.of([3]))).toBeInstanceOf(Left);
      });

      it('should return an instance of Left on Right.concat(Left)', () => {
        expect(
          Right.of([1, 2])
            .concat(Left.of([3]))
            .unsafeGet().length
        ).toEqual(1);
        expect(Right.of([1, 2]).concat(Left.of([3]))).toBeInstanceOf(Left);
      });

      it('should return an instance of Left on Left.concat(Left)', () => {
        expect(
          Left.of([1, 2])
            .concat(Left.of([3]))
            .unsafeGet().length
        ).toEqual(2);
        expect(Left.of([1, 2]).concat(Left.of([3]))).toBeInstanceOf(Left);
      });

      it('should throw TypeError if values are not concatable with .concat', () => {
        expect(() => Right.of(true).concat(Right.of(false))).toThrow(TypeError);
      });
    });
  });

  describe('helpers', () => {
    it('should return true for isRight', () => expect(Right.of(3).isRight).toBe(true));
    it('should return true for isLeft', () => expect(Right.of(3).isLeft).toBe(false));
  });

  describe('getOrElse', () => {
    it('should return the internal value', () => {
      expect(Right.of(3).getOrElse(() => 2 / 0)).toEqual(3);
    });
  });

  describe('swap', () => {
    it('should return a Left', () => expect(Right.of(3).swap()).toBeInstanceOf(Left));
    it('should pass its value to the Left', () =>
      expect(
        Right.of(3)
          .swap()
          .unsafeGet()
      ).toEqual(3));
  });

  describe('equals', () => {
    it('should return false if Either subclasses do not match', () =>
      expect(Right.of(3).equals(Left.of(3) as any)).toBe(false));

    it('should return false if internal values do not match', () =>
      expect(Right.of(3).equals(Left.of(4) as any)).toBe(false));

    it('should return true if Eithers are indeed equal', () => expect(Right.of(3).equals(Right.of(3))).toBe(true));
  });

  describe('ap', () => {
    it('should apply the function in the Either to the value of another value', () => {
      expect(
        Right.of(3)
          .ap(Right.of((x) => x + 3))
          .unsafeGet()
      ).toEqual(6);
      expect(Right.of(3).ap(Right.of((x) => x + 3))).toBeInstanceOf(Right);
    });

    it('should not apply the function in the Either to the value of the Left', () => {
      expect(
        Right.of((x) => x + 3)
          .ap(Left.of(3) as any)
          .unsafeGet()
      ).toEqual(3);
      expect(Right.of((x) => x + 3).ap(Left.of(3) as any)).toBeInstanceOf(Left);
    });

    it('should throw a TypeError if the Either does not hold a function', () => {
      expect(() => Right.of(3).ap(Right.of(3))).toThrow(TypeError);
    });
  });

  describe('chain', () => {
    it('should execute provided function and pass the value for another monad', () => {
      expect(
        Right.of(3)
          .chain((x) => Right.of(x + 3))
          .unsafeGet()
      ).toEqual(6);
    });
  });

  describe('map', () => {
    it('should return a new Right with provided function executed on it', () => {
      expect(Right.of(3).map((x) => x + 3)).toBeInstanceOf(Right);
      expect(
        Right.of(3)
          .map((x) => x + 3)
          .unsafeGet()
      ).toEqual(6);
    });
  });

  describe('fold', () => {
    it('should execute provided function and fold the value from the Either', () => {
      expect(Right.of(3).fold(() => {}, (r) => r)).toEqual(3);
    });
  });

  describe('right.toString', () => {
    it('should return string representation of the Right', () => {
      expect(Right.of('test').toString()).toEqual('Right(test)');
    });
  });

  describe('[Symbol.species]', () => {
    it('should be OK', () => {
      expect(Right[Symbol.species]).toBe(Right);
    });
  });

  describe('Setoid', () => {
    it('REFLEXIVITY a.equals(a) === true', () => {
      const a = Right.of(3);
      expect(a.equals(a)).toEqual(true);
    });

    it('SYMMETRY a.equals(b) === b.equals(a)', () => {
      const a = Right.of(3);
      const b = Right.of(3);
      expect(a.equals(b)).toEqual(b.equals(a));
    });

    it('TRANSITIVITY if a.equals(b) and b.equals(c) then a.equals(c)', () => {
      const a = Right.of(3);
      const b = Right.of(3);
      const c = Right.of(3);

      expect(a.equals(b) && b.equals(c)).toEqual(a.equals(c));
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
      ).toEqual(a.concat(b.concat(c)).unsafeGet());
    });
  });

  describe('Functor', () => {
    it('IDENTITY u.map(a => a) is equivalent to u', () => {
      const u = Right.of(1);

      expect(u.map((a) => a).equals(u)).toEqual(true);
    });

    it('COMPOSITION u.map(x => f(g(x))) is equivalent to u.map(g).map(f)', () => {
      const u = Right.of(1);
      const f = (x) => x + 1;
      const g = (x) => x + 2;

      expect(u.map((x) => f(g(x))).unsafeGet()).toEqual(
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

      expect(v.ap(u.ap(a.map((f) => (g) => (x) => (f as any)((g as any)(x))))).toString()).toEqual(
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
      ).toEqual(m.chain((x) => f(x).chain(g)).unsafeGet());
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
      ).toEqual(f(a).unsafeGet());
    });

    it('RIGHT IDENTITY m.chain(M.of) is equivalent to m', () => {
      const m = Right.of(1);

      expect(m.chain(Right.of).unsafeGet()).toEqual(m.unsafeGet());
    });
  });
});
