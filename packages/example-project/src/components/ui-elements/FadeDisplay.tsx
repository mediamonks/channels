import { Slider } from './Slider';
import { useState } from 'react';
import { useInterval } from '../../hooks/useInterval';
import { HasSignalModifier } from '@mediamonks/channels';

type Props = {
  entity: HasSignalModifier;
};

export const FadeDisplay = ({ entity }: Props) => {
  const [fadeValue, setFadeValue] = useState(entity.getFadeVolume());

  useInterval(() => {
    setFadeValue(entity.getFadeVolume());
  }, 10);

  return (
    <Slider min={0} max={1} value={fadeValue} enabled={false} label={'fade'} />
  );
};
