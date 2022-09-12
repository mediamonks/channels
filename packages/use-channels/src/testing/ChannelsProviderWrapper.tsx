import { ReactNode } from 'react';
import { ChannelsProvider } from '../ChannelsProvider';

export const ChannelsProviderWrapper = ({
  children,
}: {
  children: ReactNode;
}) => (
  <ChannelsProvider
    soundsExtension="mp3"
    soundsPath="path/"
    sounds={[{ name: 'sound' }]}
  >
    {channelsInstance => {
      // sets a default audiobuffer for loaded sounds
      (channelsInstance.audioContext as any).DECODE_AUDIO_DATA_RESULT =
        channelsInstance.audioContext.createBuffer(2, 44100, 44100);

      return children;
    }}
  </ChannelsProvider>
);
