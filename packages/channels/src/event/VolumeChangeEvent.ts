import { createEventClass } from 'seng-event';
import { HasSignalModifier } from '../types';

export type VolumeChangeData = {
  target: HasSignalModifier;
};

export class VolumeChangeEvent extends createEventClass<VolumeChangeData>()(
  'VOLUME_CHANGE'
) {}
