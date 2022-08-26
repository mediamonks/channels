import { ChangeEvent } from 'react';

type Props = {
  enabled?: boolean;
  min: number;
  max: number;
  onChange?: (value: number) => void;
  value: number;
  sliderMax?: number; // defines the resolution of the slider
};

const wrapValue = (value: number, min: number, max: number) =>
  Math.max(Math.min(value, max), min);

const valueToSliderValue = (
  value: number,
  min: number,
  max: number,
  sliderMax: number
) => ((wrapValue(value, min, max) - min) / (max - min)) * sliderMax;

const sliderValueToValue = (
  sliderValue: number,
  min: number,
  max: number,
  sliderMax: number
) => min + ((max - min) * sliderValue) / sliderMax;

export const Slider = ({
  enabled = true,
  onChange,
  min,
  max,
  value,
  sliderMax = 100,
}: Props) => {
  const onSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedSliderValue = parseInt(event.target.value);
    if (!isNaN(parsedSliderValue)) {
      onChange?.(sliderValueToValue(parsedSliderValue, min, max, sliderMax));
    }
  };

  return (
    <input
      type="range"
      onChange={onSliderChange}
      value={valueToSliderValue(value, min, max, sliderMax)}
      max={sliderMax}
      disabled={!enabled}
    />
  );
};
