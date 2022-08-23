import { ICreateSample, ISample } from 'sample-manager';
import { Channel } from './Channel';

export type Sound = ISample;
export type CreateSound = ICreateSample;

export type OptionalChannel = {
  channel?: string | Channel;
};
