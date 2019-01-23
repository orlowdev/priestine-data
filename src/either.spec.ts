import { Either } from './either';
import { Left } from './left';
import { Right } from './right';

declare const sdfsdf: () => any;

describe('Either', () => {
  const mock = (x) => Either.fromNullable(x);
  const foldMock = (x) => x.fold(() => null, (x) => x);

  describe('of', () => {
    it('should return a Right', () => {
      expect(Either.of(3).constructor.name).toEqual(Right.of(3).constructor.name);
      expect(Either.of(3)).toEqual(Right.of(3));
      expect(Either.of(3)).toBeInstanceOf(Right);
    });
  });

  describe('of', () => {
    it('should return a Right', () => expect(Either.of(3)).toBeInstanceOf(Right));
  });

  describe('left', () => {
    it('should return a Left', () => expect(Either.left(3)).toBeInstanceOf(Left));
  });

  describe('fromNullable', () => {
    it('should return a Right if provided data is != null', () => expect(foldMock(mock(123))).toEqual(123));

    it('should return a Left if provided data is == null', () => {
      expect(foldMock(mock(undefined))).toEqual(null);
      expect(foldMock(mock(null))).toEqual(null);
      expect(foldMock(mock(false))).not.toEqual(null);
    });
  });

  describe('try', () => {
    it('should return Left on error', () => {
      expect(Either.try(() => sdfsdf())).toBeInstanceOf(Left);
      expect(Either.try(() => sdfsdf()).unsafeGet()).toBeInstanceOf(ReferenceError);
      expect(Either.try(() => sdfsdf()).unsafeGet()).toBeInstanceOf(Error);
    });

    it('should return Right on success', () => {
      expect(Either.try(() => 1 + 1)).toBeInstanceOf(Right);
      expect(Either.try(() => 1 + 3).unsafeGet()).toEqual(4);
    });
  });
});
