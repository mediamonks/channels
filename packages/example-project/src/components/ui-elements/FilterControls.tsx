import { useEffect, useState } from 'react';
import { Slider } from './Slider';

type Props = {
  filter: BiquadFilterNode;
};

export const FilterControls = ({ filter }: Props) => {
  const [frequency, setFrequency] = useState(400);

  useEffect(() => {
    filter.frequency.value = frequency;
  }, [filter, frequency]);

  return (
    <Slider
      min={10}
      max={5000}
      value={frequency}
      onChange={value => {
        setFrequency(value);
      }}
    />
  );
};
