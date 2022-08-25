import React, { useEffect, useState } from 'react';
import { useChannels } from '../hooks/useChannels';
import { PlayingSoundsListItem } from './PlayingSoundsListItem';
import { PlayingSound } from '@mediamonks/channels';
import { ChannelsEvent } from '@mediamonks/channels/dist/event/ChannelsEvent';

export const PlayingSoundsList = () => {
  const channelsInstance = useChannels();
  const [playingSounds, setPlayingSounds] = useState<Array<PlayingSound>>([]);

  const stopAll = () => channelsInstance.stopAll();

  useEffect(() => {
    const onPlayingSoundsUpdate = () => {
      setPlayingSounds(channelsInstance.getPlayingSounds());
    };

    channelsInstance.addEventListener(
      ChannelsEvent.types.PLAYING_SOUNDS_CHANGE,
      onPlayingSoundsUpdate
    );
    return () =>
      channelsInstance.removeEventListener(
        ChannelsEvent.types.PLAYING_SOUNDS_CHANGE,
        onPlayingSoundsUpdate
      );
  }, [channelsInstance]);

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
