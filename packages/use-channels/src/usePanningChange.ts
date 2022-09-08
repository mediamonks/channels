import { useChannels } from './useChannels';
import { useEffect } from 'react';
import { Channel, PanChangeEvent, PlayingSound } from '@mediamonks/channels';

type Props = {
  target?: PlayingSound | Channel;
  onChange: (value: number) => void;
};

export const usePanningChange = ({ onChange, target }: Props) => {
  const channelsInstance = useChannels();

  useEffect(() => {
    const dispatcher = target || channelsInstance;
    const listener = ({ data: { pan } }: PanChangeEvent) => {
      onChange(pan);
    };

    dispatcher.addEventListener(PanChangeEvent.types.PAN_CHANGE, listener);

    return () =>
      dispatcher.removeEventListener(PanChangeEvent.types.PAN_CHANGE, listener);
  }, [channelsInstance, onChange, target]);
};
