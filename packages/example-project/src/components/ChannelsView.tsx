import { Channels } from '@mediamonks/channels';
import React from 'react';
import { VolumeSlider } from './VolumeSlider';

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
            <strong>{name}</strong>
            <button onClick={() => stopAllOnChannel(name)}>stop all</button>
            <div>
              <VolumeSlider
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
