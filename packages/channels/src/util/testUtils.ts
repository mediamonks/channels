import { newServer } from 'mock-xmlhttprequest';
import { Channels } from '../Channels';

export const mockXMLHttpRequest = () => {
  const server = newServer({
    get: [
      () => true,
      {
        status: 200,
        body: new ArrayBuffer(10000000),
      } as any,
    ],
  });
  server.install();
};

export const createMockChannelsInstance = () => {
  const channelsInstance = new Channels({
    soundsPath: 'path',
    soundsExtension: 'mp3',
  });

  // sets a default audiobuffer for loaded sounds
  (channelsInstance.audioContext as any).DECODE_AUDIO_DATA_RESULT =
    channelsInstance.audioContext.createBuffer(2, 44100, 44100);

  return channelsInstance;
};

export const getAudioGraph = (channels: Channels) =>
  (channels.audioContext as any).toJSON();
