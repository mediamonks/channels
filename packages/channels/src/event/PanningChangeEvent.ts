import { createEventClass } from 'seng-event';
import { HasVolume } from '../types';

export type PanningChangeData = {
  target: HasVolume;
};

export class PanningChangeEvent extends createEventClass<PanningChangeData>()(
  'PANNING_CHANGE'
) {}
