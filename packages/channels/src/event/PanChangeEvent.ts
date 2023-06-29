import { createEventClass } from 'seng-event';

export type PanChangeData = {
  pan: number;
};

export class PanChangeEvent extends createEventClass<PanChangeData>()('PAN_CHANGE') {}
