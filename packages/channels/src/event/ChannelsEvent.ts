import { createEventClass } from 'seng-event';

export class ChannelsEvent extends createEventClass()(
  'PLAYING_SOUNDS_UPDATED',
  'CHANNELS_UPDATED'
) {}
