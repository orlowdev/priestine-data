import { expect } from 'chai';
import { Task } from './task';

describe('Task', () => {
  describe('Task.of', () => {
    it('should return a Task', () => {
      expect(Task.of('test')).to.be.instanceof(Task);
    });

    it('should refer to the value as the successful branch', () => {
      expect(Task.of('test').fork(() => 'fail', (x) => x)).to.equal('test');
    });
  });

  describe('task.of', () => {
    it('should return a Task', () => {
      expect(Task.of('test').of('test1')).to.be.instanceof(Task);
    });

    it('should refer to the value as the successful branch', () => {
      expect(Task.of('test').of('test1').fork(() => 'fail', (x) => x)).to.equal('test1');
    });
  });

  describe('Task.empty', () => {
    it('should return a Task', () => {
      expect(Task.empty()).to.be.instanceof(Task);
    });

    it('should return a Task that will never resolve', () => {
      expect(Task.empty().fork(() => 'fail', (x) => x)).to.equal(undefined);
    });
  });

  describe('task.empty', () => {
    it('should return a Task', () => {
      expect(Task.empty().empty()).to.be.instanceof(Task);
    });

    it('should return a Task that will never resolve', () => {
      expect(Task.empty().empty().fork(() => 'fail', (x) => x)).to.equal(undefined);
    });
  });

  describe('Task.rejected', () => {
    it('should return a Task', () => {
      expect(Task.rejected('test')).to.be.instanceof(Task);
    });

    it('should return a rejected Task', () => {
      expect(Task.rejected('test').fork(() => 'fail', (x) => x)).to.equal('fail');
    });
  });

  describe('task.rejected', () => {
    it('should return a Task', () => {
      expect(Task.rejected('test').rejected(1)).to.be.instanceof(Task);
    });

    it('should return a rejected Task', () => {
      expect(Task.rejected('test').rejected(1).fork(() => 'fail', (x) => x)).to.equal('fail');
    });
  });

  describe('constructor', () => {
    it('should apply default cleanup function if it was not provided', () => {
      expect(new Task((reject, resolve) => {}).cleanup()).to.equal(undefined);
    });
  });

  describe('task.ap', () => {
    it('should apply the successful value of another task to current task', () => {
      let r;
      Task.of((x) => x + 1).ap(Task.of(2)).fork(() => {}, (x) => r = x);
      expect(r).to.equal(3);
    });

    it('should not apply the failure value of another task to current task', () => {
      let r;
      Task.of((x) => x + 1).ap(Task.rejected(2)).fork(() => {}, (x) => r = x);
      expect(r).to.equal(undefined);
    });

    it('should not apply the successful value of another task to current failure task', () => {
      let r;
      Task.rejected((x) => x + 1).ap(Task.of(2)).fork(() => {}, (x) => r = x);
      expect(r).to.equal(undefined);
    });

    it('should not apply the rejected value of another task to current failure task', () => {
      let r;
      Task.rejected((x) => x + 1).ap(Task.rejected(2)).fork(() => {}, (x) => r = x);
      expect(r).to.equal(undefined);
    });
  });

  describe('task.fork@reject', () => {
    it('should be triggered if task has a failure value', () => {
      expect(Task.rejected('test').fork((x) => x, (x) => 'success')).to.equal('test');
    });

    it('should not be triggered if task has a success value', () => {
      expect(Task.of('test').fork((x) => x, (x) => 'success')).to.equal('success');
    });
  });

  describe('task.fork@resolve', () => {
    it('should not be triggered if task has a failure value', () => {
      expect(Task.rejected('test').fork((x) => x, (x) => x + '_success')).to.equal('test');
    });

    it('should be triggered if task has a success value', () => {
      expect(Task.of('test').fork((x) => x + '_failure', (x) => x)).to.equal('test');
    });
  });

  describe('task.chain', () => {
    it('should transform the successful value of another task using a function to a monad', () => {
      expect(Task.of(2).chain((x) => Task.of(x + 1)).fork(() => {}, (x) => x)).to.equal(3);
    });

    it('should transform the successful value even if another task is rejected', () => {
      expect(Task.of(2).chain((x) => Task.rejected(x + 1)).fork((x) => x, (x) => x)).to.equal(3);
    });

    it('should not transform the successful value of another task to current failure task', () => {
      expect(Task.rejected(2).chain((x) => Task.of(x + 1)).fork((x) => x, (x) => x)).to.equal(2);
    });

    it('should not transform the rejected value of another task to current failure task', () => {
      expect(Task.rejected(2).chain((x) => Task.rejected(x + 1)).fork((x) => x, (x) => x)).to.equal(2);
    });
  });

  describe('task.map', () => {
    it('should transform the successful value of another task using a function to a monad', () => {
      expect(Task.of(2).map((x) => x + 1).fork(() => {}, (x) => x)).to.equal(3);
    });

    it('should not transform the successful value of another task to current failure task', () => {
      expect(Task.rejected(2).map((x) => x + 1).fork((x) => x, (x) => x)).to.equal(2);
    });
  });

  describe('task.bimap', () => {
    it('should map both sides of the disjunction if the value is a success', () => {
      expect(Task.of(2).bimap((x) => x + 1, (x) => x - 1).fork(() => {}, (x) => x)).to.equal(1);
    });

    it('should map both sides of the disjunction if the value is a failure', () => {
      expect(Task.rejected(2).bimap((x) => x + 1, (x) => x - 1).fork((x) => x, (x) => x)).to.equal(3);
    });
  });

  describe('task.rejectedMap', () => {
    it('should transform the rejected value of another task using a function to a monad', () => {
      expect(Task.of(2).rejectedMap((x) => x + 1).fork((x) => x, (x) => x)).to.equal(2);
    });

    it('should not transform the rejected value of another task to current failure task', () => {
      expect(Task.rejected(2).rejectedMap((x) => x + 1).fork((x) => x, (x) => x)).to.equal(3);
    });
  });

  describe('task.orElse', () => {
    it('should do nothing if the value is a success', () => {
      expect(Task.of(2).orElse((x) => Task.of(x + 1)).fork(() => {}, (x) => x)).to.equal(2);
    });

    it('should transform a failure value into a new Task if the value is a failure', () => {
      expect(Task.rejected(2).orElse((x) => Task.of(x + 1)).fork((x) => x, (x) => x)).to.equal(3);
    });
  });

  describe('task.swap', () => {
    it('should swap the disjunction values for success value', () => {
      expect(Task.of(2).swap().fork(() => {}, (x) => x)).to.equal(undefined);
    });

    it('should swap the disjunction values for failure value', () => {
      expect(Task.rejected(2).swap().fork((x) => x, () => {})).to.equal(undefined);
    });
  });

  describe('task.fold', () => {
    it('should apply the leftmost function to the failure', () => {
      expect(Task.of(2).fold((x) => x - 1, (x) => x + 1).fork((x) => x, (x) => x)).to.equal(3);
    });

    it('should apply the rightmost function to the success', () => {
      expect(Task.rejected(2).fold((x) => x - 1, (x) => x + 1).fork((x) => x, (x) => x)).to.equal(1);
    });
  });

  describe('task.toString', () => {
    it('should return string representation of the task', () => {
      expect(Task.empty().toString()).to.equal('[object Task]');
    });
  });

  describe('task.concat', () => {
    it('should select the earlier of the two Tasks', () => {
      let r;
      Task.of(2).concat(Task.of(3)).fork((x) => r = x, (x) => r = x);
      expect(r).to.equal(2);
    });

    it('should select the earlier of the two Tasks', () => {
      let r;
      Task.rejected(2).concat(Task.of(3)).fork((x) => r = x, (x) => r = x);
      expect(r).to.equal(2);
    });
  });
});