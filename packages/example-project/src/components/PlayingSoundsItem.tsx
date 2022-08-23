import React, { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { PlayingSound } from '@mediamonks/channels/dist/PlayingSound';
import { ProgressBar } from './ProgressBar';

type Props = {
  playingSound: PlayingSound;
};

export const PlayingSoundsItem = ({ playingSound }: Props) => {
  const [progress, setProgress] = useState(0);

  useInterval(() => {
    setProgress(playingSound.getProgress());
  }, 10);
  return (
    <div style={{ backgroundColor: 'lightblue' }}>
      <p>
        <strong>{playingSound.sound.name}</strong>
        &nbsp;
        <small>(channel {playingSound.channel?.name || '---'})</small>
      </p>
      <button onClick={() => playingSound.stop()}>stop</button>
      <ProgressBar progress={progress} foregroundColor={'red'} height={5} />
    </div>
  );
};
