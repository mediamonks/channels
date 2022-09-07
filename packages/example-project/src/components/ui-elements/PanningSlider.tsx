import { Slider } from './Slider';
import { useEffect, useState } from 'react';
import { HasVolume } from '@mediamonks/channels';
import { useChannels } from '@mediamonks/use-channels';
import { PanningChangeEvent } from '@mediamonks/channels/dist/event/PanningChangeEvent';

type Props = {
  entity: HasVolume;
  enabled?: boolean;
};

export const PanningSlider = ({ entity }: Props) => {
  const channels = useChannels();
  const [panningSliderValue, setPanningSliderValue] = useState(entity.getPan());

  useEffect(() => {
    const listener = ({ data }: PanningChangeEvent) => {
      if (data.target === entity) {
        setPanningSliderValue(data.target.getPan());
      }
    };
    channels.addEventListener(
      PanningChangeEvent.types.PANNING_CHANGE,
      listener
    );

    return () =>
      channels.removeEventListener(
        PanningChangeEvent.types.PANNING_CHANGE,
        listener
      );
  }, [channels]);

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
