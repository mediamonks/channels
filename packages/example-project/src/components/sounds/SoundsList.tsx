import React, { useState } from 'react';
import { useChannels } from '@mediamonks/use-channels';
import { SoundsListItem } from './SoundsListItem';
import { EffectsChain, PlaySoundOptions } from '@mediamonks/channels';

type Props = {
  effectsChain?: EffectsChain;
};

export const SoundsList = ({ effectsChain }: Props) => {
  const channelsInstance = useChannels();
  const [loopIsChecked, setLoopIsChecked] = useState(false);
  const [fadeInTime, setFadeInTime] = useState(0);
  const [applyEffect, setApplyEffect] = useState(false);
  const [startTimeOffset, setStartTimeOffset] = useState(0);

  const playSound = (
    soundName: string,
    channelName: string | undefined,
    usePlayOptions: boolean,
  ) => {
    const options: PlaySoundOptions = { channel: channelName };
    if (usePlayOptions) {
      options.loop = loopIsChecked;
      options.fadeInTime = fadeInTime;
      // todo: take a look at this (i changed options type from any to PlaySoundOptions, now gives error on this prop. not sure if effectsChain worked before
      // options.effectsChain = applyEffect ? effectsChain : undefined;
      options.startTimeOffset = startTimeOffset;
    }
    channelsInstance.play(soundName, options);
  };

  return (
    <div>
      <h2>Available sounds</h2>
      <div className="block-padding top-block">
        <label>
          play looped
          <input
            type="checkbox"
            checked={loopIsChecked}
            onChange={() => setLoopIsChecked((value) => !value)}
          />
        </label>
        {effectsChain && (
          <label>
            effects
            <input
              type="checkbox"
              checked={applyEffect}
              onChange={() => setApplyEffect((value) => !value)}
            />
          </label>
        )}
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
        <label>
          start time
          <input
            style={{ width: 30 }}
            type="text"
            value={startTimeOffset}
            onChange={({ target }) => {
              setStartTimeOffset(parseFloat(target.value));
            }}
          />
        </label>
      </div>
      <ul className="blocks">
        {channelsInstance.getSounds().map((sound) => (
          <li key={sound.name}>
            <SoundsListItem sound={sound} playSound={playSound} />
          </li>
        ))}
      </ul>
    </div>
  );
};
