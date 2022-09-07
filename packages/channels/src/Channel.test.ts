import { Channel } from './Channel';
import { VolumeNodes } from './VolumeNodes';
import { ChannelsEvent } from './event/ChannelsEvent';
import { Channels } from './Channels';
import 'web-audio-test-api';

import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import {
  createMockChannelsInstance,
  getAudioGraph,
  getNodeChain,
  mockXMLHttpRequest,
} from './util/testUtils';

mockXMLHttpRequest();

describe('Channel', () => {
  let channelsInstance: Channels;

  beforeEach(() => {
    channelsInstance = createMockChannelsInstance();
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

      const [
        mainFadeNode,
        mainGainNode,
        mainPannerNode,
        channelFadeNode,
        channelGainNode,
        channelPannerNode,
      ] = getNodeChain(getAudioGraph(channelsInstance));
      expect(mainGainNode.name).toBe('GainNode');
      expect(mainFadeNode.name).toBe('GainNode');
      expect(mainPannerNode.name).toBe('StereoPannerNode');
      expect(channelFadeNode.name).toBe('GainNode');
      expect(channelGainNode.name).toBe('GainNode');
      expect(channelPannerNode.name).toBe('StereoPannerNode');
      expect(mainGainNode.gain?.value).toBe(1);
      expect(mainFadeNode.gain?.value).toBe(1);
      expect(channelFadeNode.gain?.value).toBe(1);
      expect(channelGainNode.gain?.value).toBe(1);

      expect(mainFadeNode.inputs.length).toBe(1);
      expect(mainGainNode.inputs.length).toBe(1);
      expect(mainPannerNode.inputs.length).toBe(1);
      expect(channelFadeNode.inputs.length).toBe(1);
      expect(channelGainNode.inputs.length).toBe(1);
      expect(channelPannerNode.inputs.length).toBe(0);
    });

    it('connects two channels to the main output', () => {
      channelsInstance?.createChannel('ch1');
      channelsInstance?.createChannel('ch2');
      const destinationNode = getAudioGraph(channelsInstance);
      const mainFadeNode = destinationNode.inputs[0];
      const mainGainNode = mainFadeNode.inputs[0];
      const mainPannerNode = mainGainNode.inputs[0];

      expect(mainFadeNode.inputs.length).toBe(1);
      expect(mainGainNode.inputs.length).toBe(1);
      expect(mainPannerNode.inputs.length).toBe(2);
    });
  });

  describe('Channel volume', () => {
    it('sets channel volume', () => {
      const channel = channelsInstance.createChannel('ch');

      channel.setVolume(0.5);
      const [, , , , channelGainNode] = getNodeChain(
        getAudioGraph(channelsInstance)
      );

      expect(channelGainNode.name).toBe('GainNode');
      expect(channelGainNode.gain?.value).toBe(0.5);
      expect(channelGainNode.gain?.value).toBe(0.5);
      expect(channelsInstance.getChannel('ch').getVolume()).toBe(0.5);
    });
    it('Has default volume', () => {
      const channel = channelsInstance.createChannel('ch');

      const [
        mainFade,
        mainVolume,
        mainPanner,
        channelFadeNode,
        channelGainNode,
      ] = getNodeChain(getAudioGraph(channelsInstance));

      expect(mainFade.name).toBe('GainNode');
      expect(mainVolume.name).toBe('GainNode');
      expect(mainPanner.name).toBe('StereoPannerNode');
      expect(channelFadeNode.name).toBe('GainNode');
      expect(channelGainNode.name).toBe('GainNode');
      expect(channelGainNode.gain?.value).toBe(1);
      expect(channelFadeNode.gain?.value).toBe(1);
      expect(channel.getVolume()).toBe(1);
      expect(channel.getFadeVolume()).toBe(1);
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
        volume: 0.5,
      });
      const [, , , , channelGainNode] = getNodeChain(
        getAudioGraph(channelsInstance)
      );
      expect(channelGainNode.name).toBe('GainNode');
      expect(channelGainNode.gain?.value).toBe(0.5);
      expect(channel.getVolume()).toBe(0.5);
    });
    it('adds preVolume effect', () => {
      const filter = channelsInstance.audioContext.createBiquadFilter();

      channelsInstance.createChannel('channel', {
        effects: { preVolume: { input: filter, output: filter } },
      });

      const [
        mainFade,
        mainVolume,
        mainPanner,
        channelFade,
        channelVolume,
        channelPanner,
        filterNode,
      ] = getNodeChain(getAudioGraph(channelsInstance));

      expect(mainFade.name).toBe('GainNode');
      expect(mainVolume.name).toBe('GainNode');
      expect(mainPanner.name).toBe('StereoPannerNode');
      expect(channelFade.name).toBe('GainNode');
      expect(channelVolume.name).toBe('GainNode');
      expect(channelPanner.name).toBe('StereoPannerNode');
      expect(filterNode.name).toBe('BiquadFilterNode');
    });
    it('adds postVolume effect', () => {
      const filter = channelsInstance.audioContext.createBiquadFilter();

      channelsInstance.createChannel('channel', {
        effects: { postVolume: { input: filter, output: filter } },
      });

      const [
        mainFade,
        mainVolume,
        mainPanner,
        filterNode,
        channelFade,
        channelVolume,
        channelPanner,
      ] = getNodeChain(getAudioGraph(channelsInstance));

      expect(mainFade.name).toBe('GainNode');
      expect(mainVolume.name).toBe('GainNode');
      expect(mainPanner.name).toBe('StereoPannerNode');
      expect(channelFade.name).toBe('GainNode');
      expect(channelVolume.name).toBe('GainNode');
      expect(channelPanner.name).toBe('StereoPannerNode');
      expect(filterNode.name).toBe('BiquadFilterNode');
    });
    it('adds effect pre and post volume', () => {
      const filter = channelsInstance.audioContext.createBiquadFilter();
      const convolver = channelsInstance.audioContext.createConvolver();

      channelsInstance.createChannel('channel', {
        effects: {
          postVolume: { input: filter, output: filter },
          preVolume: { input: convolver, output: convolver },
        },
      });

      const [
        mainFade,
        mainVolume,
        mainPanner,
        filterNode,
        channelFade,
        channelVolume,
        channelPanner,
        convolverNode,
      ] = getNodeChain(getAudioGraph(channelsInstance));

      expect(mainFade.name).toBe('GainNode');
      expect(mainVolume.name).toBe('GainNode');
      expect(mainPanner.name).toBe('StereoPannerNode');
      expect(channelFade.name).toBe('GainNode');
      expect(channelVolume.name).toBe('GainNode');
      expect(channelPanner.name).toBe('StereoPannerNode');
      expect(filterNode.name).toBe('BiquadFilterNode');
      expect(convolverNode.name).toBe('ConvolverNode');
    });
  });
});
