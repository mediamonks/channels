import { Slider } from './Slider';
import { useState } from 'react';
import { useVolumeChange } from '@mediamonks/use-channels';
import { HasSignalModifier } from '@mediamonks/channels';

type Props = {
  entity: HasSignalModifier;
  enabled?: boolean;
};

export const VolumeSlider = ({ entity }: Props) => {
  const [volumeSliderValue, setVolumeSliderValue] = useState(
    entity.getVolume()
  );

  useVolumeChange({
    target: entity,
    onChange: (value: number) => {
      setVolumeSliderValue(value);
    },
  });

  return (
    <Slider
      min={0}
      max={1}
      value={volumeSliderValue}
      onChange={value => {
        entity.setVolume(value);
      }}
    />
  );
};
