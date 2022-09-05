import { Channels } from '../Channels';

export const getAudioGraph = (channels: Channels) =>
  (channels.audioContext as any).toJSON();
