import { ICreateSample, ISample } from 'sample-manager';
import { Channel } from './Channel';

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
}
