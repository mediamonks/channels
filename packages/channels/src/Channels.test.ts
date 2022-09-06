import { Channels } from './Channels';
import 'web-audio-test-api';
import SampleManager from 'sample-manager';
import { mockXMLHttpRequest } from './test/mockXMLHttpRequest';
import { mockChannelsInstance } from './test/mockChannelsInstance';
import { getAudioGraph } from './test/getAudioGraph';
import { AudioContext } from './util/audioContext';

mockXMLHttpRequest();

describe('Channels instance', () => {
  let channelsInstance: Channels;

  beforeEach(() => {
    channelsInstance = mockChannelsInstance();
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
  it('adds preVolume effect', () => {
    const context = new AudioContext();
    const filter = context.createBiquadFilter();
    const channelsInstance = new Channels({
      soundsPath: 'path',
      soundsExtension: 'mp3',
      audioContext: context,
      effects: {
        preVolume: { input: filter, output: filter },
      },
    });

    channelsInstance.createChannel('channel');

    const destinationNode = getAudioGraph(channelsInstance);
    const mainFadeNode = destinationNode.inputs[0];
    const mainGainNode = mainFadeNode.inputs[0];
    const filterNode = mainGainNode.inputs[0];
    const channelFadeNode = filterNode.inputs[0];
    const channelGainNode = channelFadeNode.inputs[0];

    expect(filterNode.name).toBe('BiquadFilterNode');
    expect(channelFadeNode.name).toBe('GainNode');
    expect(channelGainNode.name).toBe('GainNode');
  });
  it('adds postVolume effect', () => {
    const context = new AudioContext();
    const filter = context.createBiquadFilter();
    const channelsInstance = new Channels({
      soundsPath: 'path',
      soundsExtension: 'mp3',
      audioContext: context,
      effects: {
        postVolume: { input: filter, output: filter },
      },
    });

    const destinationNode = getAudioGraph(channelsInstance);
    const filterNode = destinationNode.inputs[0];
    const mainFadeNode = filterNode.inputs[0];
    const mainGainNode = mainFadeNode.inputs[0];

    expect(filterNode.name).toBe('BiquadFilterNode');
    expect(mainFadeNode.name).toBe('GainNode');
    expect(mainGainNode.name).toBe('GainNode');
  });
  it('adds post and preVolume effect', () => {
    const context = new AudioContext();
    const filter = context.createBiquadFilter();
    const convolver = context.createConvolver();
    const channelsInstance = new Channels({
      soundsPath: 'path',
      soundsExtension: 'mp3',
      audioContext: context,
      effects: {
        postVolume: { input: filter, output: filter },
        preVolume: { input: convolver, output: convolver },
      },
    });

    const destinationNode = getAudioGraph(channelsInstance);
    const filterNode = destinationNode.inputs[0];
    const mainFadeNode = filterNode.inputs[0];
    const mainGainNode = mainFadeNode.inputs[0];
    const convolverNode = mainGainNode.inputs[0];

    expect(filterNode.name).toBe('BiquadFilterNode');
    expect(mainFadeNode.name).toBe('GainNode');
    expect(mainGainNode.name).toBe('GainNode');
    expect(convolverNode.name).toBe('ConvolverNode');
  });
});
