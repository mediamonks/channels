import React, { useState } from 'react';
import { Sound } from '@mediamonks/channels';
import { useChannels } from '@mediamonks/use-channels';

type Props = {
  sound: Sound;
  playSound: (
    soundName: string,
    channelName: string | undefined,
    usePlayOptions: boolean
  ) => void;
};

export const SoundsListItem = ({ sound: { name }, playSound }: Props) => {
  const channels = useChannels();
  const [usePlayOptions, setUsePlayOptions] = useState(false);

  return (
    <div style={{ backgroundColor: 'lightcoral' }} className="block-padding">
      <h3>{name}</h3>
      <div>
        <div>
          <label>
            <small>use playOptions on play</small>
            <input
              type="checkbox"
              checked={usePlayOptions}
              onChange={() => {
                setUsePlayOptions(value => !value);
              }}
            />
          </label>
        </div>
        <button onClick={() => playSound(name, undefined, usePlayOptions)}>
          play
        </button>
        {channels.getChannels().map(({ name: channelName }) => (
          <button
            key={channelName}
            onClick={() => playSound(name, channelName, usePlayOptions)}
          >
            play on '{channelName}'
          </button>
        ))}
      </div>
    </div>
  );
};
