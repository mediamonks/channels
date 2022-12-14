import { Channel } from '@mediamonks/channels';
import { useChannels } from '@mediamonks/use-channels';
import React from 'react';
import { VolumeControls } from '../ui-elements/VolumeControls';

type Props = {
  channel: Channel;
};

export const ChannelsListItem = ({ channel }: Props) => {
  const channelsInstance = useChannels();
  const sounds = channelsInstance.getSounds();

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
        {channel.type === 'monophonic' ? <small> (monophonic)</small> : null}
      </h3>
      <p>
        {channel.defaultPlayStopOptions !== undefined &&
          Object.keys(channel.defaultPlayStopOptions).length > 0 && (
            <small>
              {JSON.stringify(channel.defaultPlayStopOptions, null, 2)}
            </small>
          )}
      </p>
      <button
        onClick={() => channelsInstance.stopAll({ channel: channel.name })}
      >
        stop all sounds on this channel
      </button>
      <button onClick={fadeOut}>fade out</button>
      <button onClick={fadeIn}>fade in</button>
      <div>
        <VolumeControls entity={channel} />
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
