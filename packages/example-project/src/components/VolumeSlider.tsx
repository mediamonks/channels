import { ChangeEvent, useEffect, useState } from 'react';
import { useInterval } from '../hooks/useInterval';

type Props = {
  gainNode: GainNode;
  label?: string;
  enabled?: boolean;
};

const SLIDER_MAX = 100;

export const VolumeSlider = ({ gainNode, enabled = true }: Props) => {
  const [value, setValue] = useState(gainNode.gain.value);

  useEffect(() => {
    gainNode.gain.value = value;
  }, [value]);

  const onSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedValue = parseInt(event.target.value) / SLIDER_MAX;
    if (!isNaN(parsedValue)) {
      setValue(parsedValue);
    }
  };

  useInterval(() => {
    setValue(gainNode.gain.value);
  }, 50);

  return (
    <input
      type="range"
      onChange={onSliderChange}
      value={value * SLIDER_MAX}
      max={SLIDER_MAX}
      disabled={!enabled}
    />
  );
};
