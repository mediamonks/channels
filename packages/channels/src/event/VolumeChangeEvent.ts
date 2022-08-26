import { createEventClass } from 'seng-event';
import { HasVolume } from '../types';

export type VolumeChangeData = {
  target: HasVolume;
};

export class VolumeChangeEvent extends createEventClass<VolumeChangeData>()(
  'VOLUME_CHANGE'
) {}
