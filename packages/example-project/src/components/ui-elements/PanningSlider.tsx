import { Slider } from './Slider';
import { useState } from 'react';
import { HasSignalModifier } from '@mediamonks/channels';
import { usePanningChange } from '@mediamonks/use-channels';

type Props = {
  entity: HasSignalModifier;
  enabled?: boolean;
};

export const PanningSlider = ({ entity }: Props) => {
  const [sliderValue, setSliderValue] = useState(entity.getPan());

  usePanningChange({
    onChange: value => setSliderValue(value),
    target: entity,
  });

  return (
    <Slider
      label={'pan'}
      min={-1}
      max={1}
      value={sliderValue}
      onChange={value => {
        entity.setPan(value);
      }}
    />
  );
};
