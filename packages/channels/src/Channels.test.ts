import { Channels } from './Channels';
import 'web-audio-test-api';

describe('Channels', () => {
  it('initializes', () => {
    const channels = new Channels({
      soundsPath: 'path',
      soundsExtension: 'mp3',
    });

    expect(channels).toBeInstanceOf(Channels);
  });
});
