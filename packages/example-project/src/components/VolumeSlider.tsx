import { ChangeEvent, useState } from 'react';
import { Channels } from '@mediamonks/channels';

type Props = {
  channelsInstance: Channels;
  label?: string;
  channelName?: string;
};

const SLIDER_MAX = 100;

export const VolumeSlider = ({
  channelName,
  channelsInstance,
  label,
}: Props) => {
  const [value, setValue] = useState(channelsInstance.getVolume(channelName));

  const onSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(event.target.value) / SLIDER_MAX;
    if (!isNaN(parsedValue)) {
      setValue(parsedValue);
      channelsInstance.setVolume(parsedValue, { channel: channelName });
    }
  };
  return (
    <label>
      <strong>{label}</strong>
      <input
        type="range"
        onChange={onSliderChange}
        value={value * SLIDER_MAX}
        max={SLIDER_MAX}
      />
    </label>
  );
};
