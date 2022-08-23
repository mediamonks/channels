import React, { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { useChannels } from '../hooks/useChannels';
import { PlayingSound } from '@mediamonks/channels/dist/PlayingSound';
import { PlayingSoundsItem } from './PlayingSoundsItem';

export const PlayingSounds = () => {
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
            <PlayingSoundsItem playingSound={playingSound} />
          </li>
        ))}
      </ul>
    </div>
  );
};
