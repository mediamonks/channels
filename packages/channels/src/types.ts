import { ICreateSample, ISample } from 'sample-manager';
import { SoundChannel } from './SoundChannel';

export type Sound = ISample;
export type CreateSound = ICreateSample;

export type OptionalChannel = {
  channel?: string | SoundChannel;
};
