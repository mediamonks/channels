import { Slider } from './Slider';
import { useState } from 'react';
import { useVolumeChange } from '@mediamonks/use-channels';
import { HasSignalModifier } from '@mediamonks/channels';

type Props = {
  entity: HasSignalModifier;
  enabled?: boolean;
};

export const VolumeSlider = ({ entity }: Props) => {
  const [sliderValue, setSliderValue] = useState(entity.getVolume());

  useVolumeChange({
    target: entity,
    onChange: (value: number) => {
      setSliderValue(value);
    },
  });

  return (
    <Slider
      label={'volume'}
      min={0}
      max={1}
      value={sliderValue}
      onChange={value => {
        entity.setVolume(value);
      }}
    />
  );
};
