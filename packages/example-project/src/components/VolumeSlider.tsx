import { Slider } from './Slider';
import { useEffect, useState } from 'react';
import { VolumeNodes, VolumeNodesEvent } from '@mediamonks/channels';

type Props = {
  volumeNodes: VolumeNodes;
  enabled?: boolean;
};

export const VolumeSlider = ({ volumeNodes }: Props) => {
  const [volumeSliderValue, setVolumeSliderValue] = useState(
    volumeNodes.getVolume()
  );

  useEffect(() => {
    const onVolumeChange = () => {
      setVolumeSliderValue(volumeNodes.getVolume());
    };

    volumeNodes.addEventListener(
      VolumeNodesEvent.types.VOLUME_CHANGE,
      onVolumeChange
    );
    return () =>
      volumeNodes.removeEventListener(
        VolumeNodesEvent.types.VOLUME_CHANGE,
        onVolumeChange
      );
  }, [volumeNodes]);

  return (
    <Slider
      min={0}
      max={1}
      value={volumeSliderValue}
      onChange={value => {
        volumeNodes.setVolume(value);
      }}
    />
  );
};
