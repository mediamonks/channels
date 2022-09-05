import { Channel } from './Channel';
import { VolumeNodes } from './VolumeNodes';
import { ChannelsEvent } from './event/ChannelsEvent';
import { Channels } from './Channels';
import { mockChannelsInstance } from './test/mockChannelsInstance';
import { mockXMLHttpRequest } from './test/mockXMLHttpRequest';
import { getAudioGraph } from './test/getAudioGraph';

mockXMLHttpRequest();

describe('Channel', () => {
  let channelsInstance: Channels;

  beforeEach(() => {
    channelsInstance = mockChannelsInstance();
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
