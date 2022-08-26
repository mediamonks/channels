import React from 'react';
import { useChannels } from '../../hooks/useChannels';
import { ChannelsListItem } from './ChannelsListItem';

export const ChannelsList = () => {
  const channelsInstance = useChannels();
  const channels = channelsInstance.getChannels();

  return (
    <div>
      <h2>Channels</h2>
      <ul className="blocks">
        {channels.map(channel => (
          <li key={channel.name}>
            <ChannelsListItem channel={channel} />
          </li>
        ))}
      </ul>
    </div>
  );
};
