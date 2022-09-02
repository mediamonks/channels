import { ICreateSample, ISample } from 'sample-manager';
import { Channel } from './Channel';
import { Analyser } from './Analyser';

export type Sound = ISample;
export type CreateSound = ICreateSample;

export type OptionalChannel = {
  channel?: string | Channel;
};

export interface HasVolume {
  getFadeVolume(): number;
  getVolume(): number;
  setVolume(value: number): void;
  mute: () => void;
  unmute: () => void;
  fadeOut: (duration: number, onComplete?: () => void) => void;
  fadeIn: (duration: number, onComplete?: () => void) => void;
  getAnalyser: () => Analyser | undefined;
}

export interface CanConnectMediaElement extends HasVolume {
  connectMediaElement: (element: HTMLMediaElement) => void;
}

export type PlayStopOptions = PlaySoundOptions & StopSoundOptions;

export type PlaySoundOptions = {
  loop?: boolean;
  fadeInTime?: number;
  volume?: number;
};

export type StopSoundOptions = {
  fadeOutTime?: number;
};

export type EffectsChain = {
  input: AudioNode;
  output: AudioNode;
};
