import { createEventClass } from 'seng-event';

export class VolumeNodesEvent extends createEventClass()(
  'VOLUME_CHANGE',
  'FADE_CHANGE'
) {}
