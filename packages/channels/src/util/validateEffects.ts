import { Effects, EffectsChain } from '../types';

export const validateEffects = ({ postVolume, preVolume }: Effects) => {
  if (preVolume) {
    validateEffectsChain(preVolume);
  }
  if (postVolume) {
    validateEffectsChain(postVolume);
  }
};

// todo: add tests
const validateEffectsChain = ({ input, output }: EffectsChain) => {
  if (input.numberOfInputs === 0) {
    throw new Error('EffectsChain has no inputs');
  }
  if (output.numberOfOutputs === 0) {
    throw new Error('EffectsChain has no outputs');
  }
};
