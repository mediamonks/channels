import { createEventClass } from 'seng-event';
import { HasSignalModifier } from '../types';

export type PanChangeData = {
  target: HasSignalModifier;
};

export class PanChangeEvent extends createEventClass<PanChangeData>()(
  'PAN_CHANGE'
) {}
