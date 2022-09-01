import { createContext, ReactNode, useContext, useMemo } from 'react';
import { Channels } from '@mediamonks/channels';

export const channelsContext = createContext<Channels | null>(null);

export const useChannels = () => {
  const contextValue = useContext(channelsContext);

  if (contextValue === null) {
    throw new Error(
      'Channels instance not found, use the ChannelsProvider in a parent component'
    );
  }

  return contextValue;
};

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
