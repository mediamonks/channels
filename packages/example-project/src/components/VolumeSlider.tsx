import { Slider } from './Slider';
import { useState } from 'react';
import { VolumeNodes } from '@mediamonks/channels';
import { useInterval } from '../hooks/useInterval';

type Props = {
  volumeNodes: VolumeNodes;
  enabled?: boolean;
};

export const VolumeSlider = ({ volumeNodes }: Props) => {
  const [volumeValue, setVolumeValue] = useState(volumeNodes.volume);

  useInterval(() => {
    setVolumeValue(volumeNodes.volume);
  }, 10);

  return (
    <Slider
      min={0}
      max={1}
      value={volumeValue}
      onChange={value => {
        volumeNodes.volume = value;
      }}
    />
  );
};
