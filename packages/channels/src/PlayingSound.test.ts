import {
  createMockChannelsInstance,
  getAudioGraph,
  getNodeChain,
  mockXMLHttpRequest,
} from './util/testUtils';
import { Channels } from './Channels';
import 'web-audio-test-api';

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
      pannerNode,
      volumeGain,
      soundFadeGain,
      soundPannerNode,
      soundVolumeGain,
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
  it('adds pre-volume effects for a playing sound', () => {
    const filter = channelsInstance.audioContext.createBiquadFilter();
    channelsInstance.play('sound', {
      effects: { preVolume: { input: filter, output: filter } },
    });
    const [
      fadeGain,
      pannerNode,
      volumeGain,
      soundFadeGain,
      soundPannerNode,
      soundVolumeGain,
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
      pannerNode,
      volumeGain,
      filterNode,
      soundFadeGain,
      soundPannerNode,
      soundVolumeGain,
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
      pannerNode,
      volumeGain,
      filterNode,
      soundFadeGain,
      soundPannerNode,
      soundVolumeGain,
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
