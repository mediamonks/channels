import { EffectsChain } from '../types';

// todo: add tests
export const validateEffectsChain = ({ input, output }: EffectsChain) => {
  if (input.numberOfInputs === 0) {
    throw new Error('EffectsChain has no inputs');
  }
  if (output.numberOfOutputs === 0) {
    throw new Error('EffectsChain has no outputs');
  }
};
