import { Slider } from './Slider';
import { VolumeNodes } from '@mediamonks/channels';
import { useState } from 'react';
import { useInterval } from '../hooks/useInterval';

type Props = {
  volumeNodes: VolumeNodes;
};

export const FadeDisplay = ({ volumeNodes }: Props) => {
  const [fadeValue, setFadeValue] = useState(volumeNodes.fadeVolume);

  useInterval(() => {
    setFadeValue(volumeNodes.fadeVolume);
  }, 10);

  return <Slider min={0} max={1} value={fadeValue} enabled={false} />;
};
