import React from 'react';
import { useChannels } from '../hooks/useChannels';
import { ChannelsViewItem } from './ChannelsViewItem';

export const ChannelsView = () => {
  const channelsInstance = useChannels();
  const channels = channelsInstance.getChannels();

  return (
    <div>
      <h2>Channels</h2>
      <ul className="blocks">
        {channels.map(channel => (
          <ChannelsViewItem key={channel.name} channel={channel} />
        ))}
      </ul>
    </div>
  );
};
