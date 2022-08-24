import { Slider } from './Slider';
import { HasVolumeNodes } from '@mediamonks/channels';
import { useState } from 'react';
import { useInterval } from '../hooks/useInterval';

type Props = {
  entity: HasVolumeNodes;
};

export const FadeDisplay = ({ entity }: Props) => {
  const [fadeValue, setFadeValue] = useState(entity.fadeVolume);

  useInterval(() => {
    setFadeValue(entity.fadeVolume);
  }, 10);

  return <Slider min={0} max={1} value={fadeValue} enabled={false} />;
};
