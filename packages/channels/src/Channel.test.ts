import { Channel } from './Channel';
import { ChannelsEvent } from './event/ChannelsEvent';
import { Channels } from './Channels';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import {
  createMockChannelsInstance,
  getAudioGraph,
  getNodeChain,
  mockXMLHttpRequest,
} from './testing/testUtils';
import { PanChangeEvent } from './event/PanChangeEvent';

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
    it('has a lists of created channels', () => {
      const ch1 = channelsInstance.createChannel('channel1');
      const ch2 = channelsInstance.createChannel('channel2');
      expect(channelsInstance.getChannels()).toContain(ch1);
      expect(channelsInstance.getChannels()).toContain(ch2);
      expect(channelsInstance.getChannels().length).toBe(2);
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
      expect(channelsInstance.getChannel('ch').getVolume()).toBe(0.5);
    });
    it('sets channel panning', () => {
      const channel = channelsInstance.createChannel('ch');

      channel.setPan(0.75);
      const [, , , , , channelPanningNode] = getNodeChain(
        getAudioGraph(channelsInstance)
      );

      expect(channelPanningNode.name).toBe('StereoPannerNode');
      expect(channelPanningNode.pan?.value).toBe(0.75);
      expect(channelsInstance.getChannel('ch').getPan()).toBe(0.75);
    });
    it('Has default volume and panning', () => {
      const channel = channelsInstance.createChannel('ch');

      const [
        mainFade,
        mainVolume,
        mainPanner,
        channelFadeNode,
        channelGainNode,
        channelPanningNode,
      ] = getNodeChain(getAudioGraph(channelsInstance));

      expect(mainFade.name).toBe('GainNode');
      expect(mainVolume.name).toBe('GainNode');
      expect(mainPanner.name).toBe('StereoPannerNode');
      expect(channelFadeNode.name).toBe('GainNode');
      expect(channelGainNode.name).toBe('GainNode');
      expect(channelGainNode.gain?.value).toBe(1);
      expect(channelFadeNode.gain?.value).toBe(1);
      expect(channelPanningNode.pan?.value).toBe(0);
      expect(channel.getVolume()).toBe(1);
      expect(channel.getFadeVolume()).toBe(1);
      expect(channel.getPan()).toBe(0);
    });
    it("dispatches an event when setting a channel's volume", () => {
      const listener = jest.fn();
      const channel = channelsInstance.createChannel('ch');
      channel.addEventListener(VolumeChangeEvent.types.VOLUME_CHANGE, listener);
      channel.setVolume(0.5);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ volume: 0.5 }),
        })
      );
    });
    it("dispatches an event when setting a channel's panning", () => {
      const listener = jest.fn();
      const channel = channelsInstance.createChannel('ch');
      channel.addEventListener(PanChangeEvent.types.PAN_CHANGE, listener);
      channel.setPan(0.5);
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ pan: 0.5 }),
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
    it('creates channel with initial panning', () => {
      const channel = channelsInstance.createChannel('channel', {
        pan: 0.75,
      });
      const [, , , , , channelPanningNode] = getNodeChain(
        getAudioGraph(channelsInstance)
      );
      expect(channelPanningNode.name).toBe('StereoPannerNode');
      expect(channelPanningNode.pan?.value).toBe(0.75);
      expect(channel.getPan()).toBe(0.75);
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
