import { ChangeEvent, useEffect, useRef, useState } from 'react';

const SLIDER_RESOLUTION = 100;

type Props = {
  enabled?: boolean;
  min: number;
  max: number;
  onChange?: (value: number) => void;
  value: number;
};

const wrapValue = (value: number, min: number, max: number) =>
  Math.max(Math.min(value, max), min);

const valueToSliderValue = (value: number, min: number, max: number) =>
  (wrapValue(value, min, max) - min) / (max - min);

const sliderValueToValue = (sliderValue: number, min: number, max: number) =>
  min + (max - min) * sliderValue;

export const Slider = ({
  enabled = true,
  onChange,
  min,
  max,
  value,
}: Props) => {
  const [sliderValue, setSliderValue] = useState(
    valueToSliderValue(value, min, max)
  );

  const mouseDownRef = useRef(false);

  const onSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    const parsedSliderValue = parseInt(event.target.value) / SLIDER_RESOLUTION;
    if (!isNaN(parsedSliderValue)) {
      onChange?.(sliderValueToValue(parsedSliderValue, min, max));
    }
  };

  useEffect(() => {
    setSliderValue(valueToSliderValue(value, min, max));
  }, [value, min, max]);

  useEffect(() => {
    onChange?.(sliderValueToValue(sliderValue, min, max));
  }, [sliderValue]);

  return (
    <input
      onMouseDown={() => (mouseDownRef.current = true)}
      onMouseLeave={() => (mouseDownRef.current = false)}
      type="range"
      onChange={onSliderChange}
      value={sliderValue * SLIDER_RESOLUTION}
      max={SLIDER_RESOLUTION}
      disabled={!enabled}
    />
  );
};
