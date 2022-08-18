import { ChangeEvent, useState } from 'react';

type Props = {
  gain: GainNode;
  name?: string;
};

const SLIDER_MAX = 100;

export const VolumeSlider = ({ name, gain }: Props) => {
  const [value, setValue] = useState(gain.gain.value);
  const onSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(event.target.value) / SLIDER_MAX;
    if (!isNaN(parsedValue)) {
      setValue(parsedValue);
      gain.gain.setValueAtTime(parsedValue, 0);
    }
  };
  return (
    <label>
      <strong>{name}</strong>
      <input
        type="range"
        onChange={onSliderChange}
        value={value * SLIDER_MAX}
        max={SLIDER_MAX}
      />
    </label>
  );
};
