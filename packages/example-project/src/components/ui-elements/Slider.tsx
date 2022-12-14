import { ChangeEvent } from 'react';

type Props = {
  label?: string;
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
  label,
  sliderMax = 1000,
}: Props) => {
  const onSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedSliderValue = parseFloat(event.target.value);

    if (!isNaN(parsedSliderValue)) {
      onChange?.(sliderValueToValue(parsedSliderValue, min, max, sliderMax));
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      {label && (
        <div style={{ width: 50, opacity: 0.8 }}>
          <small>
            <strong>{label}</strong>
          </small>
        </div>
      )}
      <input
        type="range"
        onChange={onSliderChange}
        value={valueToSliderValue(value, min, max, sliderMax)}
        max={sliderMax}
        disabled={!enabled}
      />
    </div>
  );
};
