import React from 'react';
import { VolumeControlsView } from './VolumeControlsView';
import { useChannels } from '../hooks/useChannels';

export const ChannelsView = () => {
  const channelsInstance = useChannels();
  const channels = channelsInstance.getChannels();

  return (
    <div>
      <h2>Channels</h2>
      <ul className="blocks">
        {channels.map(({ name, type }) => (
          <li
            key={name}
            style={{
              backgroundColor: 'lightsteelblue',
            }}
          >
            <h3>
              Channel: {name}
              {type === 'monophonic' ? <small>(monophonic)</small> : null}
            </h3>
            <button onClick={() => channelsInstance.stopAll({ channel: name })}>
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
