import { ICreateSample, ISample } from 'sample-manager';
import { Analyser } from './Analyser';

export type Sound = ISample;
export type CreateSound = ICreateSample;

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
  effectsChain?: EffectsChain;
  channel?: string;
};

export type StopSoundOptions = {
  fadeOutTime?: number;
};

export type EffectsChain<
  I extends AudioNode = AudioNode,
  O extends AudioNode = AudioNode
> = {
  input: I;
  output: O;
};

export type AnalyserMode = 'pre-volume' | 'post-volume';

export type FFTSize =
  | 32
  | 64
  | 128
  | 256
  | 512
  | 1024
  | 2048
  | 4096
  | 8192
  | 16384
  | 32768;

export type AnalyserSettings = {
  fftSize?: FFTSize;
  mode: AnalyserMode;
};
