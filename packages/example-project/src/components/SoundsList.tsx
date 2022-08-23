import React, { useState } from 'react';
import { useChannels } from '../hooks/useChannels';
import { SoundsListItem } from './SoundsListItem';

export const SoundsList = () => {
  const channelsInstance = useChannels();
  const [loopIsChecked, setLoopIsChecked] = useState(false);
  const [fadeOutIsChecked, setFadeOutIsChecked] = useState(false);

  const playSound = (soundName: string, channelName?: string) => {
    channelsInstance.play(soundName, {
      channel: channelName,
      loop: loopIsChecked,
    });
  };

  return (
    <div>
      <h2>Available sounds</h2>
      <div>
        <label>
          play looped
          <input
            type={'checkbox'}
            checked={loopIsChecked}
            onChange={() => setLoopIsChecked(value => !value)}
          />
        </label>
        <label>
          play with fadeout
          <input
            type={'checkbox'}
            checked={fadeOutIsChecked}
            onChange={() => setFadeOutIsChecked(value => !value)}
          />
        </label>
      </div>
      <ul className="blocks">
        {channelsInstance.getAllSounds().map(sound => (
          <SoundsListItem
            key={sound.name}
            sound={sound}
            playSound={playSound}
          />
        ))}
      </ul>
    </div>
  );
};
