import { ICreateSample, ISample } from 'sample-manager';

export type SoundChannelType = 'monophonic' | 'polyphonic';
export type Sound = ISample;
export type CreateSound = ICreateSample;

type BaseSoundChannel = {
  name: string;
  volumeControls: VolumeControls;
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

export type PlayingSound = {
  context: AudioContext;
  sound: Sound;
  bufferSourceNode: AudioBufferSourceNode;
  gainNode: GainNode;
  channel?: SoundChannel;
  stop: () => void;
};

export type VolumeControls = {
  input: GainNode;
  output: GainNode;
  volume: GainNode;
  mute: GainNode;
};
