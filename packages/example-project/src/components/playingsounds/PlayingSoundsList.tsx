import React from 'react';
import { useChannels, usePlayingSounds } from '@mediamonks/use-channels';
import { PlayingSoundsListItem } from './PlayingSoundsListItem';

export const PlayingSoundsList = () => {
  const channelsInstance = useChannels();

  const playingSounds = usePlayingSounds();

  const stopAll = () => channelsInstance.stopAll();

  return (
    <div>
      <h2>Playing sounds</h2>
      <div className="block-padding top-block">
        <button onClick={stopAll}>stop all sounds</button>
      </div>
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
