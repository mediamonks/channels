import { createEventClass } from 'seng-event';
import { HasVolume } from '../types';

export type PanChangeData = {
  target: HasVolume;
};

export class PanChangeEvent extends createEventClass<PanChangeData>()(
  'PAN_CHANGE'
) {}
