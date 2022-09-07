import { ICreateSample, ISample } from 'sample-manager';

export type Sound = ISample;
export type CreateSound = ICreateSample;

export type SignalModifierOptions = {
  volume?: number;
  fadeVolume?: number;
  pan?: number;
  effects?: Effects;
};

type SignalModifierOptionsWithoutFadeVolume = Omit<
  SignalModifierOptions,
  'fadeVolume'
>;

export type ChannelType = 'monophonic' | 'polyphonic';

export type CreateChannelOptions = {
  type?: ChannelType;
  defaultPlayStopOptions?: PlayStopOptions;
} & SignalModifierOptionsWithoutFadeVolume;

export interface HasSignalModifier {
  // todo: rename to HasVolumeNodes? although volumenodes isnt covering everything in there anymore (has a lot more now)
  getFadeVolume: () => number;
  getVolume: () => number;
  setVolume: (value: number) => void;
  mute: () => void;
  unmute: () => void;
  fadeOut: (duration: number, onComplete?: () => void) => void;
  fadeIn: (duration: number, onComplete?: () => void) => void;
  setPan: (value: number) => void;
  getPan: () => number;
}

export interface CanConnectMediaElement extends HasSignalModifier {
  connectMediaElement: (element: HTMLMediaElement) => void;
}

export type PlayStopOptions = PlaySoundOptions & StopSoundOptions;

export type PlaySoundOptions = {
  loop?: boolean;
  fadeInTime?: number;
  channel?: string;
} & SignalModifierOptionsWithoutFadeVolume;

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
