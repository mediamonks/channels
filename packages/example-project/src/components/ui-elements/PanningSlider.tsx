import { Slider } from './Slider';
import { useState } from 'react';
import { HasVolume } from '@mediamonks/channels';
import { usePanningChange } from '@mediamonks/use-channels/dist/usePanningChange';

type Props = {
  entity: HasVolume;
  enabled?: boolean;
};

export const PanningSlider = ({ entity }: Props) => {
  const [panningSliderValue, setPanningSliderValue] = useState(
    entity.getPanning()
  );
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
        entity.setPanning(value);
      }}
    />
  );
};
