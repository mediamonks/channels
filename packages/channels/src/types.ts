import { ICreateSample, ISample } from 'sample-manager';

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
}

export interface CanConnectMediaElement extends HasVolume {
  connectMediaElement: (element: HTMLMediaElement) => void;
}

export type PlayStopOptions = PlaySoundOptions & StopSoundOptions;

export type PlaySoundOptions = {
  loop?: boolean;
  fadeInTime?: number;
  volume?: number;
  effects?: Effects;
  channel?: string;
};

export type StopSoundOptions = {
  fadeOutTime?: number;
};

export type StopAllOptions = {
  channel?: string;
  immediate?: boolean;
};

export type EffectsChain<
  I extends AudioNode = AudioNode,
  O extends AudioNode = AudioNode
> = {
  input: I;
  output: O;
};

export type Effects = {
  preVolume?: EffectsChain;
  postVolume?: EffectsChain;
};
