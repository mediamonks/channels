import {
  createMockChannelsInstance,
  getAudioGraph,
  getNodeChain,
  mockXMLHttpRequest,
} from './util/testUtils';
import { Channels } from './Channels';
import 'web-audio-test-api';

mockXMLHttpRequest();

describe('Channels instance', () => {
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
      soundFadeGain,
      soundVolumeGain,
      bufferSourceNode,
    ] = getNodeChain(getAudioGraph(channelsInstance));

    expect(fadeGain.name).toBe('GainNode');
    expect(volumeGain.name).toBe('GainNode');
    expect(soundFadeGain.name).toBe('GainNode');
    expect(soundVolumeGain.name).toBe('GainNode');
    expect(bufferSourceNode.name).toBe('AudioBufferSourceNode');
  });
  it('adds pre-volume effects for a playing sound', () => {
    const filter = channelsInstance.audioContext.createBiquadFilter();
    channelsInstance.play('sound', {
      effects: { preVolume: { input: filter, output: filter } },
    });
    const [
      fadeGain,
      volumeGain,
      soundFadeGain,
      soundVolumeGain,
      filterNode,
      bufferSourceNode,
    ] = getNodeChain(getAudioGraph(channelsInstance));

    expect(fadeGain.name).toBe('GainNode');
    expect(volumeGain.name).toBe('GainNode');
    expect(soundFadeGain.name).toBe('GainNode');
    expect(soundVolumeGain.name).toBe('GainNode');
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
      filterNode,
      soundFadeGain,
      soundVolumeGain,
      bufferSourceNode,
    ] = getNodeChain(getAudioGraph(channelsInstance));

    expect(fadeGain.name).toBe('GainNode');
    expect(volumeGain.name).toBe('GainNode');
    expect(soundFadeGain.name).toBe('GainNode');
    expect(soundVolumeGain.name).toBe('GainNode');
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
      filterNode,
      soundFadeGain,
      soundVolumeGain,
      convolverNode,
      bufferSourceNode,
    ] = getNodeChain(getAudioGraph(channelsInstance));

    expect(fadeGain.name).toBe('GainNode');
    expect(volumeGain.name).toBe('GainNode');
    expect(soundFadeGain.name).toBe('GainNode');
    expect(soundVolumeGain.name).toBe('GainNode');
    expect(filterNode.name).toBe('BiquadFilterNode');
    expect(convolverNode.name).toBe('ConvolverNode');
    expect(bufferSourceNode.name).toBe('AudioBufferSourceNode');
  });
});
