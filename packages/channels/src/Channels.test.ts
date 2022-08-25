import { Channels } from './Channels';
import 'web-audio-test-api';
import { Channel } from './Channel';
import { VolumeNodes } from './VolumeNodes';

it('initializes', () => {
  const channels = new Channels({
    soundsPath: '',
    soundsExtension: '',
  });

  expect(channels).toBeInstanceOf(Channels);
});

const getAudioGraph = (channels: Channels) =>
  (channels.audioContext as any).toJSON();

describe('Channels', () => {
  let channelsInstance: Channels;

  beforeEach(() => {
    channelsInstance = new Channels({
      soundsPath: 'path',
      soundsExtension: 'mp3',
    });
  });

  it('creates main volume nodes', () => {
    console.log(getAudioGraph(channelsInstance));
  });
  it('adds a channel', () => {
    const channel = channelsInstance?.createChannel('name');

    expect(channel).toBeInstanceOf(Channel);
    expect(channel.volumeNodes).toBeInstanceOf(VolumeNodes);
  });
});
