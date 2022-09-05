import { Channels } from '../Channels';
import 'web-audio-test-api'; // importing this will replace webaudio api with mock version

export const mockChannelsInstance = () => {
  const channelsInstance = new Channels({
    soundsPath: 'path',
    soundsExtension: 'mp3',
  });

  // sets a default audiobuffer for loaded sounds
  (channelsInstance.audioContext as any).DECODE_AUDIO_DATA_RESULT =
    channelsInstance.audioContext.createBuffer(2, 44100, 44100);

  return channelsInstance;
};
