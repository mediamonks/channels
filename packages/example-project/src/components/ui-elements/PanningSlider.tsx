import { Slider } from './Slider';
import { useState } from 'react';
import { HasSignalModifier } from '@mediamonks/channels';
import { usePanningChange } from '@mediamonks/use-channels';

type Props = {
  entity: HasSignalModifier;
  enabled?: boolean;
};

export const PanningSlider = ({ entity }: Props) => {
  const [panningSliderValue, setPanningSliderValue] = useState(entity.getPan());
  usePanningChange({
    onChange: value => setPanningSliderValue(value),
    target: entity,
  });

  return (
    <Slider
      min={-1}
      max={1}
      value={panningSliderValue}
      onChange={value => {
        entity.setPan(value);
      }}
    />
  );
};
