import { ICreateSample, ISample } from 'sample-manager';
export type Sound = ISample;
export type CreateSound = ICreateSample;

export type OptionalChannel = {
  channel?: string; // todo: add option to pass an instance
};
