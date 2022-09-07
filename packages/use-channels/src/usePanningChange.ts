import { HasVolume, PanningChangeEvent } from '@mediamonks/channels';
import { useChannels } from './useChannels';
import { useEffect } from 'react';

type Props = {
  target?: HasVolume;
  onChange: (value: number) => void;
};

export const usePanningChange = ({ onChange, target }: Props) => {
  const channelsInstance = useChannels();

  useEffect(() => {
    const targetToUse = target || channelsInstance;
    const listener = (event: PanningChangeEvent) => {
      if (event.data.target === targetToUse) {
        onChange(targetToUse.getPanning());
      }
    };

    channelsInstance.addEventListener(
      PanningChangeEvent.types.PANNING_CHANGE,
      listener
    );

    return () =>
      channelsInstance.removeEventListener(
        PanningChangeEvent.types.PANNING_CHANGE,
        listener
      );
  }, [channelsInstance, onChange, target]);
};
