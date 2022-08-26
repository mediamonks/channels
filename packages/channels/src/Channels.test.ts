import { Channels } from './Channels';
import 'web-audio-test-api';
import { Channel } from './Channel';
import { VolumeNodes } from './VolumeNodes';
import SampleManager from 'sample-manager';
import { ChannelsEvent } from './event/ChannelsEvent';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';

it('initializes', () => {
  const channels = new Channels({
    soundsPath: '',
    soundsExtension: '',
  });

  expect(channels).toBeInstanceOf(Channels);
});

const getAudioGraph = (channels: Channels) =>
  (channels.audioContext as any).toJSON();

// const logJson = (json: any) => {
//   console.log(JSON.stringify(json, null, 2));
// };

describe('Channels instance', () => {
  let channelsInstance: Channels;

  beforeEach(() => {
    channelsInstance = new Channels({
      soundsPath: 'path',
      soundsExtension: 'mp3',
    });
  });

  it('creates a sample manager', () => {
    expect(channelsInstance.sampleManager).toBeInstanceOf(SampleManager);
  });
  it('sets sound list passed in the constructor', () => {
    const channelsInstanceWithSounds = new Channels({
      soundsPath: 'path',
      soundsExtension: 'mp3',
      sounds: [{ name: 'sound1' }],
    });
    expect(
      channelsInstanceWithSounds.sampleManager.getAllSamples().length
    ).toBe(1);
    expect(
      channelsInstanceWithSounds.sampleManager.getAllSamples()[0].name
    ).toBe('sound1');
  });
  it('creates main volume nodes', () => {
    const destinationNode = getAudioGraph(channelsInstance);
    const fadeNode = destinationNode.inputs[0];
    const gainNode = fadeNode.inputs[0];

    expect(gainNode.name).toBe('GainNode');
    expect(fadeNode.name).toBe('GainNode');
    expect(gainNode.gain.value).toBe(1);
    expect(fadeNode.gain.value).toBe(1);
    expect(destinationNode.inputs.length).toBe(1);
    expect(fadeNode.inputs.length).toBe(1);
    expect(gainNode.inputs.length).toBe(0);
  });
  it('sets main volume', () => {
    channelsInstance.setVolume(0.5);
    const destinationNode = getAudioGraph(channelsInstance);
    const fadeNode = destinationNode.inputs[0];
    const gainNode = fadeNode.inputs[0];

    expect(gainNode.gain.value).toBe(0.5);
    expect(fadeNode.gain.value).toBe(1);
  });
  it('dispatches an event when setting main volume', () => {
    const listener = jest.fn();
    channelsInstance.addEventListener(
      VolumeChangeEvent.types.VOLUME_CHANGE,
      listener
    );
    channelsInstance.setVolume(0.5);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ target: channelsInstance }),
      })
    );
  });
  it("dispatches an event when setting a channel's volume", () => {
    const listener = jest.fn();
    channelsInstance.addEventListener(
      VolumeChangeEvent.types.VOLUME_CHANGE,
      listener
    );
    const channel = channelsInstance.createChannel('mychannel');
    channel.setVolume(0.5);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ target: channel }),
      })
    );
  });
  it('mutes main volume', () => {
    channelsInstance.mute();
    const destinationNode = getAudioGraph(channelsInstance);
    const fadeNode = destinationNode.inputs[0];
    const gainNode = fadeNode.inputs[0];

    expect(gainNode.gain.value).toBe(0);
    expect(fadeNode.gain.value).toBe(1);
  });
  it('restores volume after unmuting', () => {
    channelsInstance.setVolume(0.5);
    channelsInstance.mute();
    channelsInstance.unmute();
    const destinationNode = getAudioGraph(channelsInstance);
    const fadeNode = destinationNode.inputs[0];
    const gainNode = fadeNode.inputs[0];

    expect(gainNode.gain.value).toBe(0.5);
    expect(fadeNode.gain.value).toBe(1);
  });
  describe('Channel creation', () => {
    it('creates a channel', () => {
      const channel = channelsInstance.createChannel('channel');
      expect(channel).toBeInstanceOf(Channel);
      expect(channel.volumeNodes).toBeInstanceOf(VolumeNodes);
      expect(channelsInstance.getChannels().length).toBe(1);
      expect(channelsInstance.getChannel('channel').name).toBe('channel');
    });
    it('dispatches an event when creating a channel', () => {
      const listener = jest.fn();
      channelsInstance.addEventListener(
        ChannelsEvent.types.CHANNELS_CHANGE,
        listener
      );
      channelsInstance.createChannel('channel');
      expect(listener).toHaveBeenCalled();
    });

    it('creates and connects volume nodes for channel', () => {
      channelsInstance?.createChannel('name');

      const destinationNode = getAudioGraph(channelsInstance);
      const mainFadeNode = destinationNode.inputs[0];
      const mainGainNode = mainFadeNode.inputs[0];
      const channelFadeNode = mainGainNode.inputs[0];
      const channelGainNode = channelFadeNode.inputs[0];
      expect(mainGainNode.name).toBe('GainNode');
      expect(mainFadeNode.name).toBe('GainNode');
      expect(channelFadeNode.name).toBe('GainNode');
      expect(channelGainNode.name).toBe('GainNode');
      expect(mainGainNode.gain.value).toBe(1);
      expect(mainFadeNode.gain.value).toBe(1);
      expect(channelFadeNode.gain.value).toBe(1);
      expect(channelGainNode.gain.value).toBe(1);

      expect(destinationNode.inputs.length).toBe(1);
      expect(mainFadeNode.inputs.length).toBe(1);
      expect(mainGainNode.inputs.length).toBe(1);
      expect(channelFadeNode.inputs.length).toBe(1);
      expect(channelGainNode.inputs.length).toBe(0);
    });

    it('connects two channels to the main output', () => {
      channelsInstance?.createChannel('ch1');
      channelsInstance?.createChannel('ch2');
      const destinationNode = getAudioGraph(channelsInstance);
      const mainFadeNode = destinationNode.inputs[0];
      const mainGainNode = mainFadeNode.inputs[0];

      expect(mainFadeNode.inputs.length).toBe(1);
      expect(mainGainNode.inputs.length).toBe(2);
    });
  });
});
