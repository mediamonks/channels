import React from 'react';
import { VolumeControls } from './VolumeControls';
import { useChannels } from '../hooks/useChannels';

export const ChannelsView = () => {
  const channelsInstance = useChannels();
  const channels = channelsInstance.getChannels();
  const sounds = channelsInstance.getAllSounds();

  return (
    <div>
      <h2>Channels</h2>
      <ul className="blocks">
        {channels.map(channel => (
          <li
            key={channel.name}
            style={{
              backgroundColor: 'lightsteelblue',
            }}
          >
            <h3>
              Channel: {channel.name}
              {channel.type === 'monophonic' ? (
                <small>(monophonic)</small>
              ) : null}
            </h3>
            <button onClick={() => channelsInstance.stopAll({ channel })}>
              stop all sounds on this channel
            </button>
            <div>
              <VolumeControls
                channelsInstance={channelsInstance}
                channel={channel.name}
              />
            </div>
            <div>
              {sounds.map(sound => (
                <button
                  key={sound.name}
                  onClick={() => channel.play(sound.name)}
                >
                  {sound.name}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
