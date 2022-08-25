import { Slider } from './Slider';
import { useState } from 'react';
import { useInterval } from '../hooks/useInterval';
import { VolumeNodes } from '@mediamonks/channels';

type Props = {
  volumeNodes: VolumeNodes;
};

export const FadeDisplay = ({ volumeNodes }: Props) => {
  const [fadeValue, setFadeValue] = useState(volumeNodes.getFadeVolume());

  useInterval(() => {
    setFadeValue(volumeNodes.getFadeVolume());
  }, 10);

  return <Slider min={0} max={1} value={fadeValue} enabled={false} />;
};
