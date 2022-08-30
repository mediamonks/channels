import { newServer } from 'mock-xmlhttprequest';
import { Channels } from './Channels';
import 'web-audio-test-api';
import { Channel } from './Channel';
import { VolumeNodes } from './VolumeNodes';
import SampleManager from 'sample-manager';
import { ChannelsEvent } from './event/ChannelsEvent';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';

const getAudioGraph = (channels: Channels) =>
  (channels.audioContext as any).toJSON();

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

describe('Channels instance', () => {
  let channelsInstance: Channels;

  beforeEach(() => {
    channelsInstance = new Channels({
      soundsPath: 'path',
      soundsExtension: 'mp3',
    });

    // sets a default audiobuffer for loaded sounds
    (channelsInstance.audioContext as any).DECODE_AUDIO_DATA_RESULT =
      channelsInstance.audioContext.createBuffer(2, 44100, 44100);
  });

  it('initializes', () => {
    const channels = new Channels({
      soundsPath: '',
      soundsExtension: '',
    });

    expect(channels).toBeInstanceOf(Channels);
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

  describe('Loading sounds', () => {
    it('loads a sample', async () => {
      channelsInstance.sampleManager.addSample({ name: 'sound' });
      await channelsInstance.loadSounds();
      expect(
        channelsInstance.sampleManager.getSampleByName('sound').audioBuffer
      ).toBeInstanceOf(AudioBuffer);
    });
  });

  describe('Volume', function () {
    describe('Main Volume', function () {
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
      it('Sets volume', () => {
        channelsInstance.setVolume(0.5);
        const destinationNode = getAudioGraph(channelsInstance);
        const fadeNode = destinationNode.inputs[0];
        const gainNode = fadeNode.inputs[0];

        expect(gainNode.gain.value).toBe(0.5);
        expect(fadeNode.gain.value).toBe(1);
        expect(channelsInstance.getVolume()).toBe(0.5);
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
      it('mutes main volume', () => {
        channelsInstance.mute();
        const destinationNode = getAudioGraph(channelsInstance);
        const fadeNode = destinationNode.inputs[0];
        const gainNode = fadeNode.inputs[0];

        expect(channelsInstance.getVolume()).toBe(0);
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

        expect(channelsInstance.getVolume()).toBe(0.5);
        expect(gainNode.gain.value).toBe(0.5);
        expect(fadeNode.gain.value).toBe(1);
      });
    });
    describe('Channel volume', () => {
      it('sets channel volume', () => {
        const channel = channelsInstance.createChannel('ch');

        channel.setVolume(0.5);
        const destinationNode = getAudioGraph(channelsInstance);
        const mainFadeNode = destinationNode.inputs[0];
        const mainGainNode = mainFadeNode.inputs[0];
        const channelFadeNode = mainGainNode.inputs[0];
        const channelGainNode = channelFadeNode.inputs[0];

        expect(channelGainNode.gain.value).toBe(0.5);
        expect(channelGainNode.gain.value).toBe(0.5);
        expect(channelsInstance.getChannel('ch').getVolume()).toBe(0.5);

        // set through method on main channels instance
        channelsInstance.setChannelVolume('ch', 0.25);
        const destinationNode2 = getAudioGraph(channelsInstance);
        const mainFadeNode2 = destinationNode2.inputs[0];
        const mainGainNode2 = mainFadeNode2.inputs[0];
        const channelFadeNode2 = mainGainNode2.inputs[0];
        const channelGainNode2 = channelFadeNode2.inputs[0];

        expect(channelGainNode2.gain.value).toBe(0.25);
        expect(channelFadeNode2.gain.value).toBe(1);
        expect(channelsInstance.getChannel('ch').getVolume()).toBe(0.25);
      });
      it("dispatches an event when setting a channel's volume", () => {
        const listener = jest.fn();
        channelsInstance.addEventListener(
          VolumeChangeEvent.types.VOLUME_CHANGE,
          listener
        );
        const channel = channelsInstance.createChannel('ch');
        channel.setVolume(0.5);
        expect(listener).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({ target: channel }),
          })
        );
      });
      it('creates channel with initial volume', () => {
        const channel = channelsInstance.createChannel('channel', {
          initialVolume: 0.5,
        });
        const destinationNode = getAudioGraph(channelsInstance);
        const mainFadeNode = destinationNode.inputs[0];
        const mainGainNode = mainFadeNode.inputs[0];
        const channelFadeNode = mainGainNode.inputs[0];
        const channelGainNode = channelFadeNode.inputs[0];
        expect(channelGainNode.gain.value).toBe(0.5);
        expect(channel.getVolume()).toBe(0.5);
      });
    });

    describe('Sound volume', () => {
      expect(true).toBe(true); // todo
    });

    // todo: volume change on sound
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
