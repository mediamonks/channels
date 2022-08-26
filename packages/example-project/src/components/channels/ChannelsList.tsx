import React, { useEffect, useState } from 'react';
import { ChannelsListItem } from './ChannelsListItem';
import { AddChannel } from './AddChannel';
import { ChannelsEvent } from '@mediamonks/channels';
import { useChannels } from '@mediamonks/use-channels';

export const ChannelsList = () => {
  const channelsInstance = useChannels();
  const [channels, setChannels] = useState(channelsInstance.getChannels());

  useEffect(() => {
    const onChannelsChange = () => {
      setChannels(channelsInstance.getChannels());
    };
    channelsInstance.addEventListener(
      ChannelsEvent.types.CHANNELS_CHANGE,
      onChannelsChange
    );
    return () =>
      channelsInstance.removeEventListener(
        ChannelsEvent.types.CHANNELS_CHANGE,
        onChannelsChange
      );
  }, []);

  return (
    <div>
      <h2>Channels</h2>
      <AddChannel />
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
