import { ChangeEvent, useEffect, useState } from 'react';
import { VolumeNodes } from '@mediamonks/channels';

type Props = {
  volumeNodes: VolumeNodes;
};

const SLIDER_MAX = 100;

export const VolumeSlider = ({ volumeNodes }: Props) => {
  const [value, setValue] = useState(volumeNodes.volume);

  useEffect(() => {
    volumeNodes.volume = value;
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
