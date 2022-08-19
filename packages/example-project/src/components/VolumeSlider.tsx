import { ChangeEvent, useEffect, useState } from 'react';
import { Channels } from '@mediamonks/channels';

type Props = {
  channelsInstance: Channels;
  channelName?: string;
};

const SLIDER_MAX = 100;

export const VolumeSlider = ({ channelName, channelsInstance }: Props) => {
  const [value, setValue] = useState(
    channelsInstance.getVolume({ channel: channelName })
  );

  useEffect(() => {
    channelsInstance.setVolume(value, { channel: channelName });
  }, [value]);

  const onSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(event.target.value) / SLIDER_MAX;
    if (!isNaN(parsedValue)) {
      setValue(parsedValue);
    }
  };
  return (
    <label>
      <strong>volume</strong>
      <input
        type="range"
        onChange={onSliderChange}
        value={value * SLIDER_MAX}
        max={SLIDER_MAX}
      />
    </label>
  );
};
