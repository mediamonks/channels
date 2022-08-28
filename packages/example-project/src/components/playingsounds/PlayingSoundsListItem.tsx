import React, { useState } from 'react';
import { PlayingSound } from '@mediamonks/channels';
import { useInterval } from '../../hooks/useInterval';
import { ProgressBar } from '../ui-elements/ProgressBar';
import { VolumeControls } from '../ui-elements/VolumeControls';

type Props = {
  playingSound: PlayingSound;
};

export const PlayingSoundsListItem = ({ playingSound }: Props) => {
  const [progress, setProgress] = useState(0);

  useInterval(() => {
    setProgress(playingSound.getProgress());
  }, 10);

  return (
    <div style={{ backgroundColor: 'lightblue' }}>
      <div className="block-padding">
        <p>
          <strong>{playingSound.sound.name}</strong>
          &nbsp;
          <small>(channel {playingSound.channel?.name || '---'})</small>
          <button onClick={() => playingSound.stop()}>stop</button>
          <button onClick={() => playingSound.stop({ fadeOutTime: 2 })}>
            stop with fade
          </button>
        </p>
        <VolumeControls entity={playingSound} />
      </div>
      <ProgressBar progress={progress} foregroundColor={'red'} height={5} />
    </div>
  );
};
