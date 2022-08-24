import { Slider } from './Slider';
import { useState } from 'react';
import { HasVolumeNodes } from '@mediamonks/channels';
import { useInterval } from '../hooks/useInterval';

type Props = {
  entity: HasVolumeNodes;
  enabled?: boolean;
};

export const VolumeSlider = ({ entity }: Props) => {
  const [volumeValue, setVolumeValue] = useState(entity.volume);

  useInterval(() => {
    setVolumeValue(entity.volume);
  }, 10);

  return (
    <Slider
      min={0}
      max={1}
      value={volumeValue}
      onChange={value => {
        entity.volume = value;
      }}
    />
  );
};
