import { createEventClass } from 'seng-event';

export class VolumeNodesEvent extends createEventClass()(
  'VOLUME_CHANGED',
  'FADE_CHANGED'
) {}
