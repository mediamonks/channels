import { ICreateSample, ISample } from 'sample-manager';
import { SoundChannel } from './SoundChannel';

export type Sound = ISample;
export type CreateSound = ICreateSample;
//
// type BaseSoundChannel = {
//   name: string;
//   volume: Volume;
//   type: SoundChannelType;
// };

// export type PolyphonicSoundChannel = BaseSoundChannel & {
//   type: 'polyphonic';
// };
//
// export type MonophonicSoundChannel = BaseSoundChannel & {
//   type: 'monophonic';
// };

// export type SoundChannel = PolyphonicSoundChannel | MonophonicSoundChannel;

export type PlayingSound = {
  context: AudioContext;
  sound: Sound;
  bufferSourceNode: AudioBufferSourceNode;
  gainNode: GainNode;
  channel?: SoundChannel;
  stop: () => void;
  // todo: add oncomplete callback
};

export type OptionalChannel = {
  channel?: string; // todo: add option to pass an instance
};
