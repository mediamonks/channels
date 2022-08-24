import { VolumeControls } from './VolumeControls';
import React from 'react';
import { useChannels } from '../hooks/useChannels';
import { Channel } from '@mediamonks/channels';

type Props = {
  channel: Channel;
};

export const ChannelsListItem = ({ channel }: Props) => {
  const channelsInstance = useChannels();
  const sounds = channelsInstance.getAllSounds();

  const fadeOut = () => {
    channel.fadeOut(2);
  };
  const fadeIn = () => {
    channel.fadeIn(2);
  };
  return (
    <div
      className="block-padding"
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
        <VolumeControls volumeNodes={channel.volumeNodes} />
      </div>
      <div>
        {sounds.map(sound => (
          <button key={sound.name} onClick={() => channel.play(sound.name)}>
            {sound.name}
          </button>
        ))}
      </div>
    </div>
  );
};
