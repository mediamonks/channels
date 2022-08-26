import { createEventClass } from 'seng-event';
import { Channel } from '../Channel';
import { PlayingSound } from '../PlayingSound';

export type VolumeChangeData = {
  target: Channel | PlayingSound | undefined;
};

export class VolumeEvent extends createEventClass<VolumeChangeData>()(
  'VOLUME_CHANGE'
) {}
