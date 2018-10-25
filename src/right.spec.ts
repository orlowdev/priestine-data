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

  describe('isEqual', () => {
    it('should return false if Either subclasses do not match', () =>
      expect(Right.of(3).equals(Left.of(3) as any)).to.be.false);

    it('should return false if internal values do not match', () =>
      expect(Right.of(3).equals(Left.of(4) as any)).to.be.false);

    it('should return true if Eithers are indeed equal', () => expect(Right.of(3).equals(Right.of(3))).to.be.true);
  });

  describe('ap', () => {
    it('should apply the function in the Either to the value of another value', () => {
      expect(
        Right.of((x) => x + 3)
          .ap(Right.of(3))
          .unsafeGet()
      ).to.equal(6);
      expect(Right.of((x) => x + 3).ap(Right.of(3))).to.be.instanceof(Right);
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
});
