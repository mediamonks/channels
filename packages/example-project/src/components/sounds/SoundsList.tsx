import React, { useState } from 'react';
import { useChannels } from '../../hooks/useChannels';
import { SoundsListItem } from './SoundsListItem';

export const SoundsList = () => {
  const channelsInstance = useChannels();
  const [loopIsChecked, setLoopIsChecked] = useState(false);
  const [fadeInTime, setFadeInTime] = useState(0);

  const playSound = (soundName: string, channelName?: string) => {
    channelsInstance.play(soundName, {
      channel: channelName,
      loop: loopIsChecked,
      fadeInTime,
    });
  };

  return (
    <div>
      <h2>Available sounds</h2>
      <div>
        <label>
          play looped
          <input
            type="checkbox"
            checked={loopIsChecked}
            onChange={() => setLoopIsChecked(value => !value)}
          />
        </label>
        <label>
          fade in time
          <input
            style={{ width: 30 }}
            type="text"
            value={fadeInTime}
            onChange={({ target }) => {
              setFadeInTime(parseFloat(target.value));
            }}
          />
        </label>
      </div>
      <ul className="blocks">
        {channelsInstance.getSounds().map(sound => (
          <li key={sound.name}>
            <SoundsListItem sound={sound} playSound={playSound} />
          </li>
        ))}
      </ul>
    </div>
  );
};
