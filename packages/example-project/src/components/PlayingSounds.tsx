import React, { useState } from 'react';
import { PlayingSound } from '@mediamonks/channels';
import { useInterval } from '../hooks/useInterval';
import { useChannels } from '../hooks/useChannels';

export const PlayingSounds = () => {
  const channelsInstance = useChannels();
  const [playingSounds, setPlayingSounds] = useState<Array<PlayingSound>>([]);

  useInterval(() => {
    setPlayingSounds([...channelsInstance.playingSounds]);
  }, 10);

  return (
    <div>
      <h2>Playing sounds</h2>

      {playingSounds.map((playingSound, index) => (
        <div key={index} style={{ backgroundColor: 'lightblue' }}>
          <p>
            {playingSound.sound.name} {playingSound.channel?.name || ''}
          </p>
          <button onClick={playingSound.stop}>stop</button>
        </div>
      ))}
    </div>
  );
};
