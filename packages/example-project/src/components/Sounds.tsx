import React, { useState } from 'react';
import { Channels } from '@mediamonks/channels';

type Props = {
  channelsInstance: Channels;
};

export const Sounds = ({ channelsInstance }: Props) => {
  const [loopIsChecked, setLoopIsChecked] = useState(false);

  const playSound = (soundName: string, channelName?: string) => {
    channelsInstance.play(soundName, {
      channel: channelName,
      loop: loopIsChecked,
    });
  };

  const channels = channelsInstance.getChannels();

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
      </div>
      <ul className="blocks">
        {channelsInstance.sampleManager
          .getAllSamples()
          .map(({ name: soundName }) => (
            <li key={soundName} style={{ backgroundColor: 'lightcoral' }}>
              <strong>{soundName}</strong>
              <div>
                {channels.map(({ name: channelName }) => (
                  <button
                    key={channelName}
                    onClick={() => playSound(soundName, channelName)}
                  >
                    play on '{channelName}'
                  </button>
                ))}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
