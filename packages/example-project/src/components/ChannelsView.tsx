import { Channels } from '@mediamonks/channels';
import React from 'react';
import { VolumeControlsView } from './VolumeControlsView';

type Props = {
  channelsInstance: Channels;
};

export const ChannelsView = ({ channelsInstance }: Props) => {
  const channels = channelsInstance.getChannels();

  const stopAllOnChannel = (channelName: string) => {
    channelsInstance.stopAllOnChannel(channelName);
  };

  return (
    <div>
      <h2>Channels</h2>
      <ul className="blocks">
        {channels.map(({ name }) => (
          <li
            key={name}
            style={{
              backgroundColor: 'lightsteelblue',
            }}
          >
            <h3>Channel: {name}</h3>
            <button onClick={() => stopAllOnChannel(name)}>
              stop all sounds on this channel
            </button>
            <div>
              <VolumeControlsView
                channelsInstance={channelsInstance}
                channelName={name}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
