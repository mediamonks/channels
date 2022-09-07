import { ICreateSample, ISample } from 'sample-manager';

export type Sound = ISample;
export type CreateSound = ICreateSample;

export type VolumeNodesOptions = {
  volume?: number;
  fadeVolume?: number;
  panning?: number;
  effects?: Effects;
};

type VolumeNodesOptionsWithoutFadeVolume = Omit<
  VolumeNodesOptions,
  'fadeVolume'
>;

export type ChannelType = 'monophonic' | 'polyphonic';

export type CreateChannelOptions = {
  type?: ChannelType;
  defaultPlayStopOptions?: PlayStopOptions;
} & VolumeNodesOptionsWithoutFadeVolume;

export interface HasVolume {
  // todo: rename to HasVolumeNodes? although volumenodes isnt covering everything in there anymore (has a lot more now)
  getFadeVolume: () => number;
  getVolume: () => number;
  setVolume: (value: number) => void;
  mute: () => void;
  unmute: () => void;
  fadeOut: (duration: number, onComplete?: () => void) => void;
  fadeIn: (duration: number, onComplete?: () => void) => void;
  setPanning: (value: number) => void;
  getPanning: () => number;
}

export interface CanConnectMediaElement extends HasVolume {
  connectMediaElement: (element: HTMLMediaElement) => void;
}

export type PlayStopOptions = PlaySoundOptions & StopSoundOptions;

export type PlaySoundOptions = {
  loop?: boolean;
  fadeInTime?: number;
  channel?: string;
} & VolumeNodesOptionsWithoutFadeVolume;

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
