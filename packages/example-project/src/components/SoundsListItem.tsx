import React from 'react';
import { Sound } from '@mediamonks/channels';
import { useChannels } from '../hooks/useChannels';

type Props = {
  sound: Sound;
  playSound: (soundName: string, channelName?: string) => void;
};

export const SoundsListItem = ({ sound: { name }, playSound }: Props) => {
  const channels = useChannels();

  return (
    <li style={{ backgroundColor: 'lightcoral' }}>
      <strong>{name}</strong>
      <div>
        <button onClick={() => playSound(name)}>play</button>
        {channels.getChannels().map(({ name: channelName }) => (
          <button
            key={channelName}
            onClick={() => playSound(name, channelName)}
          >
            play on '{channelName}'
          </button>
        ))}
      </div>
    </li>
  );
};
