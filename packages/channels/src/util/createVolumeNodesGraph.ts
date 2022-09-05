import { validateEffectsChain } from './validateEffectsChain';
import { EffectsChain } from '../types';

type Props = {
  audioContext: AudioContext;
  effectsChain?: EffectsChain;
};

export const createVolumeNodesGraph = ({
  audioContext,
  effectsChain,
}: Props) => {
  if (effectsChain) {
    validateEffectsChain(effectsChain);
  }

  const volumeGainNode = audioContext.createGain();
  const fadeGainNode = audioContext.createGain();

  const nodesChain: Array<AudioNode> = [
    effectsChain?.output,
    volumeGainNode,
    fadeGainNode,
  ].filter((node): node is AudioNode => node !== undefined);

  // connect each node to the next
  nodesChain.forEach((node, index) => {
    if (index < nodesChain.length - 1) {
      node.connect(nodesChain[index + 1]);
    }
  });

  const input: AudioNode = nodesChain[0];
  const output: AudioNode = nodesChain[nodesChain.length - 1];

  return {
    fadeGainNode,
    volumeGainNode,
    input,
    output,
  };
};
