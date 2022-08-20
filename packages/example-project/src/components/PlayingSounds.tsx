import React, { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { useChannels } from '../hooks/useChannels';
import { PlayingSound } from '@mediamonks/channels/dist/PlayingSound';

export const PlayingSounds = () => {
  const channelsInstance = useChannels();
  const [playingSounds, setPlayingSounds] = useState<Array<PlayingSound>>([]);

  useInterval(() => {
    setPlayingSounds([...channelsInstance.playingSounds]);
  }, 10);

  const stopAll = () => channelsInstance.stopAll();

  return (
    <div>
      <h2>Playing sounds</h2>
      <button onClick={stopAll}>stop all sounds</button>
      <ul className={'blocks'}>
        {playingSounds.map((playingSound, index) => (
          <li key={index} style={{ backgroundColor: 'lightblue' }}>
            <p>
              <strong>{playingSound.sound.name}</strong>
              <small>{playingSound.channel?.name}</small>
            </p>
            <button onClick={playingSound.stop}>stop</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
