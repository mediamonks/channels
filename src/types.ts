import { ICreateSample, ISample } from 'sample-manager';

export type SoundChannelType = 'monophonic' | 'polyphonic';
export type Sample = ISample;
export type CreateSample = ICreateSample;

type BaseSoundChannel = {
  name: string;
  gain: GainNode;
  playingSamples: PlayingSample[];
  type: SoundChannelType;
  initialVolume: number;
};

export type PolyphonicSoundChannel = BaseSoundChannel & {
  type: 'polyphonic';
};

export type MonophonicSoundChannel = BaseSoundChannel & {
  type: 'monophonic';
};

export type SoundChannel = PolyphonicSoundChannel | MonophonicSoundChannel;

export type PlayingSample = {
  context: AudioContext;
  sample: Sample;
  bufferSource: AudioBufferSourceNode;
  gain: GainNode;
  channel?: SoundChannel;
  panner?: PannerNode;
};
