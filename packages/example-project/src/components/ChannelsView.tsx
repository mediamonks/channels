import { Channels } from 'channels';
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
      {channels.map(({ name, gain }) => (
        <div
          key={name}
          style={{
            backgroundColor: 'lightsteelblue',
            padding: 10,
            margin: 10,
          }}
        >
          <strong>{name}</strong>
          <button onClick={() => stopAllOnChannel(name)}>stop all</button>
          <div>
            <VolumeSlider gain={gain} />
          </div>
        </div>
      ))}
    </div>
  );
};
