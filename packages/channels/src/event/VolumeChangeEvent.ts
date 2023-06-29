import { createEventClass } from 'seng-event';

export type VolumeChangeData = {
  volume: number;
};

export class VolumeChangeEvent extends createEventClass<VolumeChangeData>()('VOLUME_CHANGE') {}
