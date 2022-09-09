import { ReactNode, useMemo } from 'react';
import { Channels } from '@mediamonks/channels';
import { channelsContext } from './useChannels';

type Props = {
  children: ReactNode | ((channelsInstance: Channels) => ReactNode);
} & ConstructorParameters<typeof Channels>[0];

export const ChannelsProvider = ({
  children,
  sounds,
  soundsPath,
  soundsExtension,
  audioContext,
}: Props) => {
  const channelsInstance = useMemo(
    () => new Channels({ soundsPath, soundsExtension, sounds, audioContext }),
    [audioContext, sounds, soundsExtension, soundsPath]
  );

  return (
    <channelsContext.Provider value={channelsInstance}>
      {typeof children === 'function' ? children(channelsInstance) : children}
    </channelsContext.Provider>
  );
};
