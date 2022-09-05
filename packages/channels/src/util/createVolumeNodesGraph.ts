import { validateEffectsChain } from './validateEffectsChain';
import { Effects } from '../types';

type Props = {
  audioContext: AudioContext;
  effects?: Effects;
};

export const createVolumeNodesGraph = ({ audioContext, effects }: Props) => {
  if (effects) {
    validateEffectsChain(effects.nodes);
  }

  const volumeGainNode = audioContext.createGain();
  const fadeGainNode = audioContext.createGain();

  const nodesChain: Array<AudioNode> = [
    effects && effects.mode === 'pre-volume' ? effects.nodes.output : undefined,
    volumeGainNode,
    fadeGainNode,
    effects && effects.mode === 'post-volume' ? effects.nodes.input : undefined,
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
