import { ReactNode } from 'react';
import { ChannelsProvider } from '../useChannels';

export const ChannelsProviderWrapper = ({
  children,
}: {
  children: ReactNode;
}) => (
  <ChannelsProvider soundsExtension="mp3" soundsPath="path/">
    {children}
  </ChannelsProvider>
);
