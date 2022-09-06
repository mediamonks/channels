import { getAudioGraph } from './test/getAudioGraph';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import { Channels } from './Channels';
import { mockChannelsInstance } from './test/mockChannelsInstance';

describe('VolumeNodes', function () {
  let channelsInstance: Channels;

  beforeEach(() => {
    channelsInstance = mockChannelsInstance();
  });

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
    it('Has default volume', () => {
      const destinationNode = getAudioGraph(channelsInstance);
      const fadeNode = destinationNode.inputs[0];
      const gainNode = fadeNode.inputs[0];

      expect(gainNode.gain.value).toBe(1);
      expect(fadeNode.gain.value).toBe(1);
      expect(channelsInstance.getVolume()).toBe(1);
      expect(channelsInstance.getFadeVolume()).toBe(1);
    });
    it('Sets volume', () => {
      channelsInstance.setVolume(0.5);
      const destinationNode = getAudioGraph(channelsInstance);
      const fadeNode = destinationNode.inputs[0];
      const gainNode = fadeNode.inputs[0];

      expect(gainNode.gain.value).toBe(0.5);
      expect(fadeNode.gain.value).toBe(1);
      expect(channelsInstance.getVolume()).toBe(0.5);
      expect(channelsInstance.getFadeVolume()).toBe(1);
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
});
