import { createContext, useContext } from 'react';
import { Channels } from '@mediamonks/channels';

export const channelsContext = createContext<Channels | null>(null);

export const useChannels = () => {
  const contextValue = useContext(channelsContext);

  if (contextValue === null) {
    throw new Error(
      'Channels instance not found, use the ChannelsProvider in a parent component'
    );
  }

  return contextValue;
};
