import { Slider } from './Slider';
import { useEffect, useState } from 'react';
import { HasVolume, VolumeChangeEvent } from '@mediamonks/channels';
import { useChannels } from '../../hooks/useChannels';

type Props = {
  entity: HasVolume;
  enabled?: boolean;
};

export const VolumeSlider = ({ entity }: Props) => {
  const channelsInstance = useChannels();
  const [volumeSliderValue, setVolumeSliderValue] = useState(
    entity.getVolume()
  );

  useEffect(() => {
    const onVolumeChange = ({ data }: VolumeChangeEvent) => {
      if (data.target === entity) {
        setVolumeSliderValue(entity.getVolume());
      }
    };

    channelsInstance.addEventListener(
      VolumeChangeEvent.types.VOLUME_CHANGE,
      onVolumeChange
    );
    return () =>
      channelsInstance.removeEventListener(
        VolumeChangeEvent.types.VOLUME_CHANGE,
        onVolumeChange
      );
  }, [channelsInstance]);

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
