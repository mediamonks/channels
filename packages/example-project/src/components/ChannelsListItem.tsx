import { VolumeControls } from './VolumeControls';
import React from 'react';
import { useChannels } from '../hooks/useChannels';
import { SoundChannel } from '@mediamonks/channels';

type Props = {
  channel: SoundChannel;
};

export const ChannelsListItem = ({ channel }: Props) => {
  const channelsInstance = useChannels();
  const sounds = channelsInstance.getAllSounds();

  const fadeOut = () => {
    channel.volumeNodes.fadeOut(4);
  };
  const fadeIn = () => {
    channel.volumeNodes.fadeIn(4);
  };
  return (
    <li
      key={channel.name}
      style={{
        backgroundColor: 'lightsteelblue',
      }}
    >
      <h3>
        Channel: {channel.name}
        {channel.type === 'monophonic' ? <small>(monophonic)</small> : null}
      </h3>
      <button onClick={() => channelsInstance.stopAll({ channel })}>
        stop all sounds on this channel
      </button>
      <button onClick={fadeOut}>fade out</button>
      <button onClick={fadeIn}>fade in</button>
      <div>
        <VolumeControls
          channelsInstance={channelsInstance}
          channel={channel.name}
        />
      </div>
      <div>
        {sounds.map(sound => (
          <button key={sound.name} onClick={() => channel.play(sound.name)}>
            {sound.name}
          </button>
        ))}
      </div>
    </li>
  );
};
