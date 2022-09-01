import { validateEffectsChain } from './validateEffectsChain';
import { EffectsChain } from '../types';

type Props = {
  audioContext: AudioContext;
  effectsChain?: EffectsChain;
  analyseMode?: 'pre-volume' | 'post-volume';
};

export const createVolumeNodesGraph = ({
  audioContext,
  effectsChain,
  analyseMode,
}: Props) => {
  if (effectsChain) {
    validateEffectsChain(effectsChain);
  }

  const volumeGainNode = audioContext.createGain();
  const fadeGainNode = audioContext.createGain();
  const analyserNode =
    analyseMode !== undefined ? audioContext.createAnalyser() : undefined;

  const nodesChain: Array<AudioNode> = [
    effectsChain?.output,
    analyseMode === 'pre-volume' ? analyserNode : undefined,
    volumeGainNode,
    fadeGainNode,
    analyseMode === 'post-volume' ? analyserNode : undefined,
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
    analyserNode,
    input,
    output,
  };
};
