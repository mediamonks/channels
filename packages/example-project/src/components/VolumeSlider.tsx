import { Slider } from './Slider';
import { useState } from 'react';
import { VolumeNodes } from '@mediamonks/channels';
import { useInterval } from '../hooks/useInterval';

type Props = {
  volumeNodes: VolumeNodes;
  enabled?: boolean;
};

export const VolumeSlider = ({ volumeNodes }: Props) => {
  const [volumeSliderValue, setVolumeSliderValue] = useState(
    volumeNodes.volume
  );

  useInterval(() => {
    setVolumeSliderValue(volumeNodes.volume);
  }, 10);

  // useEffect(() => {
  //   const onVolumeChange = () => {
  //     setVolumeSliderValue(volumeNodes.volume);
  //   };
  //
  //   volumeNodes.addEventListener(
  //     VolumeNodesEvent.types.VOLUME_CHANGED,
  //     onVolumeChange
  //   );
  //   return () =>
  //     volumeNodes.removeEventListener(
  //       VolumeNodesEvent.types.VOLUME_CHANGED,
  //       onVolumeChange
  //     );
  // }, [volumeNodes]);

  return (
    <Slider
      min={0}
      max={1}
      value={volumeSliderValue}
      onChange={value => {
        volumeNodes.volume = value;
      }}
    />
  );
};
