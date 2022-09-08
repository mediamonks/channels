import { Channel, PlayingSound, VolumeChangeEvent } from '@mediamonks/channels';
import { useChannels } from './useChannels';
import { useEffect } from 'react';

type Props = {
  target?: Channel | PlayingSound;
  onChange: (value: number) => void;
};

export const useVolumeChange = ({ onChange, target }: Props) => {
  const channelsInstance = useChannels();

  useEffect(() => {
    const dispatcher = target || channelsInstance;
    const listener = ({ data: { volume } }: VolumeChangeEvent) => {
      onChange(volume);
    };

    dispatcher.addEventListener(
      VolumeChangeEvent.types.VOLUME_CHANGE,
      listener
    );

    return () =>
      dispatcher.removeEventListener(
        VolumeChangeEvent.types.VOLUME_CHANGE,
        listener
      );
  }, [channelsInstance, onChange, target]);
};
