import React, { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { useChannels } from '../hooks/useChannels';
import { PlayingSound } from '@mediamonks/channels';
import { PlayingSoundsListItem } from './PlayingSoundsListItem';

export const PlayingSoundsList = () => {
  const channelsInstance = useChannels();
  const [playingSounds, setPlayingSounds] = useState<Array<PlayingSound>>([]);

  useInterval(() => {
    setPlayingSounds([...channelsInstance.playingSounds]);
  }, 100);

  const stopAll = () => channelsInstance.stopAll();

  return (
    <div>
      <h2>Playing sounds</h2>
      <button onClick={stopAll}>stop all sounds</button>
      <ul className={'blocks'}>
        {playingSounds.map((playingSound, index) => (
          <li key={index}>
            <PlayingSoundsListItem playingSound={playingSound} />
          </li>
        ))}
      </ul>
    </div>
  );
};
