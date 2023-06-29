import { useEffect, useState } from 'react';
import { ChannelsEvent, PlayingSound } from '@mediamonks/channels';
import { useChannels } from './useChannels';

export const usePlayingSounds = () => {
  const channelsInstance = useChannels();
  const [playingSounds, setPlayingSounds] = useState<Array<PlayingSound>>([]);

  useEffect(() => {
    const onPlayingSoundsUpdate = () => {
      setPlayingSounds(channelsInstance.getPlayingSounds());
    };

    channelsInstance.addEventListener(
      ChannelsEvent.types.PLAYING_SOUNDS_CHANGE,
      onPlayingSoundsUpdate,
    );
    return () =>
      channelsInstance.removeEventListener(
        ChannelsEvent.types.PLAYING_SOUNDS_CHANGE,
        onPlayingSoundsUpdate,
      );
  }, [channelsInstance]);

  return playingSounds;
};
