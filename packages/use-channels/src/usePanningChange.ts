import { useChannels } from './useChannels';
import { useEffect } from 'react';
import { HasSignalModifier, PanChangeEvent } from '@mediamonks/channels';

type Props = {
  target?: HasSignalModifier;
  onChange: (value: number) => void;
};

export const usePanningChange = ({ onChange, target }: Props) => {
  const channelsInstance = useChannels();

  useEffect(() => {
    const targetToUse = target || channelsInstance;
    const listener = (event: PanChangeEvent) => {
      if (event.data.target === targetToUse) {
        onChange(targetToUse.getPan());
      }
    };

    channelsInstance.addEventListener(
      PanChangeEvent.types.PAN_CHANGE,
      listener
    );

    return () =>
      channelsInstance.removeEventListener(
        PanChangeEvent.types.PAN_CHANGE,
        listener
      );
  }, [channelsInstance, onChange, target]);
};
