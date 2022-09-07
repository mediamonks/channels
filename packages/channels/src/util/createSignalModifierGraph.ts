import { validateEffects } from './validateEffects';
import { Effects } from '../types';

type Props = {
  audioContext: AudioContext;
  effects?: Effects;
};

export const createSignalModifierGraph = ({ audioContext, effects }: Props) => {
  if (effects) {
    validateEffects(effects);
  }

  const volumeGainNode = audioContext.createGain();
  const fadeGainNode = audioContext.createGain();
  const stereoPannerNode = audioContext.createStereoPanner();

  const nodesChain: Array<AudioNode> = [
    effects?.preVolume?.output,
    stereoPannerNode,
    volumeGainNode,
    fadeGainNode,
    effects?.postVolume?.input,
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
    stereoPannerNode,
  };
};
