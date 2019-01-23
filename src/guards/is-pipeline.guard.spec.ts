import { Pipeline } from '../pipeline';
import { isPipeline } from './is-pipeline.guard';

describe('isPipeline', () => {
  it('should return true if duck-type evaluation agrees that given value is a pipeline', () => {
    expect(isPipeline(Pipeline.empty())).toEqual(true);
  });
});
