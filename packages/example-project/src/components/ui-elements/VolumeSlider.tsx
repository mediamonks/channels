import { Slider } from './Slider';
import { useState } from 'react';
import { HasVolume } from '@mediamonks/channels';
import { useVolumeChange } from '@mediamonks/use-channels';

type Props = {
  entity: HasVolume;
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
