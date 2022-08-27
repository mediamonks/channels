import { HasVolume, VolumeChangeEvent } from '@mediamonks/channels';
import { useChannels } from './useChannels';
import { useEffect } from 'react';

type Props = {
  target?: HasVolume;
  onChange: (value: number) => void;
};

export const useVolumeChange = ({ onChange, target }: Props) => {
  const channelsInstance = useChannels();

  useEffect(() => {
    const targetToUse = target || channelsInstance;
    const listener = (event: VolumeChangeEvent) => {
      if (event.data.target === targetToUse) {
        onChange(targetToUse.getVolume());
      }
    };

    channelsInstance.addEventListener(
      VolumeChangeEvent.types.VOLUME_CHANGE,
      listener
    );

    return () =>
      channelsInstance.removeEventListener(
        VolumeChangeEvent.types.VOLUME_CHANGE,
        listener
      );
  }, [channelsInstance, onChange, target]);
};
