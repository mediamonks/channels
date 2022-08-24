import { OptionalChannel } from '../types';
import { Channel } from '../Channel';

/**
 * Utility function to handle often used optional channel parameters,
 * which can be either the channel's name or a channel instance
 * @param channel
 * @param channelsByName
  */
export const getOptionalChannelByNameOrInstance = (
  channel: OptionalChannel['channel'],
  channelsByName: Record<string, Channel>
): Channel | undefined => {
  if (typeof channel === 'string' && !channelsByName[channel]) {
    throw new Error(`Channel '${channel}' does not exist`);
  }
  return typeof channel === 'string' ? channelsByName[channel] : channel;
};
