import { expect } from 'chai';
import { Either } from './either';
import { Left } from './left';
import { Right } from './right';

declare const sdfsdf: () => any;

describe('Either', () => {
  const mock = (x) => Either.fromNullable(x);
  const foldMock = (x) => x.fold(() => null, (x) => x);

  describe('of', () => {
    it('should return a Right', () => {
      expect(Either.of(3).constructor.name).to.equal(Right.of(3).constructor.name);
      expect(Either.of(3)).to.not.equal(Right.of(3));
      expect(Either.of(3)).to.be.instanceof(Right);
    });
  });

  describe('of', () => {
    it('should return a Right', () => expect(Either.of(3)).to.be.instanceof(Right));
  });

  describe('left', () => {
    it('should return a Left', () => expect(Either.left(3)).to.be.instanceof(Left));
  });

  describe('fromNullable', () => {
    it('should return a Right if provided data is != null', () => expect(foldMock(mock(123))).to.equal(123));

    it('should return a Left if provided data is == null', () => {
      expect(foldMock(mock(undefined))).to.equal(null);
      expect(foldMock(mock(null))).to.equal(null);
      expect(foldMock(mock(false))).to.not.equal(null);
    });
  });

  describe('try', () => {
    it('should return Left on error', () => {
      expect(Either.try(() => sdfsdf())).to.be.instanceof(Left);
      expect(Either.try(() => sdfsdf()).unsafeGet()).to.match(/^ReferenceError/);
      expect(Either.try(() => sdfsdf()).unsafeGet()).to.be.instanceof(Error);
    });

    it('should return Right on success', () => {
      expect(Either.try(() => 1 + 1)).to.be.instanceof(Right);
      expect(Either.try(() => 1 + 3).unsafeGet()).to.equal(4);
    });
  });
});
