import {
  createMockChannelsInstance,
  getAudioGraph,
  getNodeChain,
  mockXMLHttpRequest,
} from './util/testUtils';
import { Channels } from './Channels';
import 'web-audio-test-api';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import { PanChangeEvent } from './event/PanChangeEvent';

mockXMLHttpRequest();

describe('Playing Sound', () => {
  let channelsInstance: Channels;

  beforeEach(async () => {
    channelsInstance = createMockChannelsInstance([{ name: 'sound' }]);
    await channelsInstance.loadSounds();
  });

  // todo test playing
  it('creates correct nodes when playing a sound', () => {
    channelsInstance.play('sound');
    const [
      fadeGain,
      volumeGain,
      pannerNode,
      soundFadeGain,
      soundVolumeGain,
      soundPannerNode,
      bufferSourceNode,
    ] = getNodeChain(getAudioGraph(channelsInstance));

    expect(fadeGain.name).toBe('GainNode');
    expect(volumeGain.name).toBe('GainNode');
    expect(pannerNode.name).toBe('StereoPannerNode');
    expect(soundFadeGain.name).toBe('GainNode');
    expect(soundVolumeGain.name).toBe('GainNode');
    expect(soundPannerNode.name).toBe('StereoPannerNode');
    expect(bufferSourceNode.name).toBe('AudioBufferSourceNode');
  });
  it('has default volume and panning when playing a sound', () => {
    const sound = channelsInstance.play('sound');
    const [, , , , soundVolumeGain, soundPannerNode] = getNodeChain(
      getAudioGraph(channelsInstance)
    );

    expect(soundVolumeGain.name).toBe('GainNode');
    expect(soundPannerNode.name).toBe('StereoPannerNode');
    expect(soundVolumeGain.gain?.value).toBe(1);
    expect(soundPannerNode.pan?.value).toBe(0);
    expect(sound.getVolume()).toBe(1);
    expect(sound.getPan()).toBe(0);
  });
  it('can set initial volume and panning when playing a sound', () => {
    const sound = channelsInstance.play('sound', {
      volume: 0.5,
      pan: 0.75,
    });
    const [, , , , soundVolumeGain, soundPannerNode] = getNodeChain(
      getAudioGraph(channelsInstance)
    );

    expect(soundVolumeGain.name).toBe('GainNode');
    expect(soundPannerNode.name).toBe('StereoPannerNode');
    expect(soundVolumeGain.gain?.value).toBe(0.5);
    expect(soundPannerNode.pan?.value).toBe(0.75);
    expect(sound.getVolume()).toBe(0.5);
    expect(sound.getPan()).toBe(0.75);
  });
  it("dispatches an event when setting a sound's volume", () => {
    const listener = jest.fn();
    channelsInstance.addEventListener(
      VolumeChangeEvent.types.VOLUME_CHANGE,
      listener
    );
    const sound = channelsInstance.play('sound');
    sound.setVolume(0.5);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ target: sound }),
      })
    );
  });
  it("dispatches an event when setting a sound's panning", () => {
    const listener = jest.fn();
    channelsInstance.addEventListener(
      PanChangeEvent.types.PAN_CHANGE,
      listener
    );
    const sound = channelsInstance.play('sound');
    sound.setPan(0.5);
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ target: sound }),
      })
    );
  });
  it('adds pre-volume effects for a playing sound', () => {
    const filter = channelsInstance.audioContext.createBiquadFilter();
    channelsInstance.play('sound', {
      effects: { preVolume: { input: filter, output: filter } },
    });
    const [
      fadeGain,
      volumeGain,
      pannerNode,
      soundFadeGain,
      soundVolumeGain,
      soundPannerNode,
      filterNode,
      bufferSourceNode,
    ] = getNodeChain(getAudioGraph(channelsInstance));

    expect(fadeGain.name).toBe('GainNode');
    expect(volumeGain.name).toBe('GainNode');
    expect(pannerNode.name).toBe('StereoPannerNode');
    expect(soundFadeGain.name).toBe('GainNode');
    expect(soundVolumeGain.name).toBe('GainNode');
    expect(soundPannerNode.name).toBe('StereoPannerNode');
    expect(filterNode.name).toBe('BiquadFilterNode');
    expect(bufferSourceNode.name).toBe('AudioBufferSourceNode');
  });
  it('adds post-volume effects for a playing sound', () => {
    const filter = channelsInstance.audioContext.createBiquadFilter();
    channelsInstance.play('sound', {
      effects: { postVolume: { input: filter, output: filter } },
    });
    const [
      fadeGain,
      volumeGain,
      pannerNode,
      filterNode,
      soundFadeGain,
      soundVolumeGain,
      soundPannerNode,
      bufferSourceNode,
    ] = getNodeChain(getAudioGraph(channelsInstance));

    expect(fadeGain.name).toBe('GainNode');
    expect(volumeGain.name).toBe('GainNode');
    expect(pannerNode.name).toBe('StereoPannerNode');
    expect(soundFadeGain.name).toBe('GainNode');
    expect(soundVolumeGain.name).toBe('GainNode');
    expect(soundPannerNode.name).toBe('StereoPannerNode');
    expect(filterNode.name).toBe('BiquadFilterNode');
    expect(bufferSourceNode.name).toBe('AudioBufferSourceNode');
  });
  it('adds pre and post-volume effects for a playing sound', () => {
    const filter = channelsInstance.audioContext.createBiquadFilter();
    const convolver = channelsInstance.audioContext.createConvolver();
    channelsInstance.play('sound', {
      effects: {
        preVolume: { input: convolver, output: convolver },
        postVolume: { input: filter, output: filter },
      },
    });
    const [
      fadeGain,
      volumeGain,
      pannerNode,
      filterNode,
      soundFadeGain,
      soundVolumeGain,
      soundPannerNode,
      convolverNode,
      bufferSourceNode,
    ] = getNodeChain(getAudioGraph(channelsInstance));

    expect(fadeGain.name).toBe('GainNode');
    expect(volumeGain.name).toBe('GainNode');
    expect(pannerNode.name).toBe('StereoPannerNode');
    expect(filterNode.name).toBe('BiquadFilterNode');
    expect(soundFadeGain.name).toBe('GainNode');
    expect(soundVolumeGain.name).toBe('GainNode');
    expect(soundPannerNode.name).toBe('StereoPannerNode');
    expect(convolverNode.name).toBe('ConvolverNode');
    expect(bufferSourceNode.name).toBe('AudioBufferSourceNode');
  });
});
