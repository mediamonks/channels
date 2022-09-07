import { Channels } from './Channels';
import 'web-audio-test-api';
import SampleManager from 'sample-manager';
import { AudioContext } from './util/audioContext';
import {
  getAudioGraph,
  getNodeChain,
  mockXMLHttpRequest,
} from './util/testUtils';
import { createMockChannelsInstance } from './util/testUtils';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';

mockXMLHttpRequest();

describe('Channels instance', () => {
  let channelsInstance: Channels;

  beforeEach(() => {
    channelsInstance = createMockChannelsInstance();
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
  it('Throws error when playing an unknown sound', () => {
    expect(() => {
      channelsInstance.play('sound');
    }).toThrowError("Cannot find sound: 'sound'");
  });
  it('Throws error when playing a sound that has not been loaded', () => {
    channelsInstance.sampleManager.addSamples([{ name: 'sound' }]);
    expect(() => {
      channelsInstance.play('sound');
    }).toThrowError("Sound 'sound' is not loaded");
  });

  describe('Loading sounds', () => {
    it('loads a sample that has been set after creation', async () => {
      channelsInstance.sampleManager.addSample({ name: 'sound' });
      await channelsInstance.loadSounds();
      expect(
        channelsInstance.sampleManager.getSampleByName('sound').audioBuffer
      ).toBeInstanceOf(AudioBuffer);
    });
  });
  describe('Main Volume', function () {
    it('creates main volume nodes', () => {
      const [fadeNode, gainNode, pannerNode] = getNodeChain(
        getAudioGraph(channelsInstance)
      );

      expect(gainNode.name).toBe('GainNode');
      expect(fadeNode.name).toBe('GainNode');
      expect(pannerNode.name).toBe('StereoPannerNode');
      expect(gainNode.gain?.value).toBe(1);
      expect(fadeNode.gain?.value).toBe(1);

      expect(fadeNode.inputs.length).toBe(1);
      expect(gainNode.inputs.length).toBe(1);
      expect(pannerNode.inputs.length).toBe(0);
    });
    it('Has default volume', () => {
      const [fadeNode, gainNode] = getNodeChain(
        getAudioGraph(channelsInstance)
      );

      expect(gainNode.gain?.value).toBe(1);
      expect(fadeNode.gain?.value).toBe(1);
      expect(channelsInstance.getVolume()).toBe(1);
      expect(channelsInstance.getFadeVolume()).toBe(1);
    });
    it('Sets volume', () => {
      channelsInstance.setVolume(0.5);
      const [fadeNode, gainNode] = getNodeChain(
        getAudioGraph(channelsInstance)
      );

      expect(gainNode.gain?.value).toBe(0.5);
      expect(fadeNode.gain?.value).toBe(1);
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
      const [fadeNode, gainNode] = getNodeChain(
        getAudioGraph(channelsInstance)
      );

      expect(channelsInstance.getVolume()).toBe(0);
      expect(gainNode.gain?.value).toBe(0);
      expect(fadeNode.gain?.value).toBe(1);
    });
    it('restores volume after unmuting', () => {
      channelsInstance.setVolume(0.5);
      channelsInstance.mute();
      channelsInstance.unmute();
      const [fadeNode, gainNode] = getNodeChain(
        getAudioGraph(channelsInstance)
      );

      expect(channelsInstance.getVolume()).toBe(0.5);
      expect(gainNode.gain?.value).toBe(0.5);
      expect(fadeNode.gain?.value).toBe(1);
    });
  });
  describe('Effect on main output', () => {
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

      const [mainFadeNode, mainGainNode, mainPannerNode, filterNode] =
        getNodeChain(getAudioGraph(channelsInstance));

      expect(filterNode.name).toBe('BiquadFilterNode');
      expect(mainPannerNode.name).toBe('StereoPannerNode');
      expect(mainGainNode.name).toBe('GainNode');
      expect(mainFadeNode.name).toBe('GainNode');
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

      const [filterNode, mainFadeNode, mainGainNode, mainPannerNode] =
        getNodeChain(getAudioGraph(channelsInstance));

      expect(filterNode.name).toBe('BiquadFilterNode');
      expect(mainFadeNode.name).toBe('GainNode');
      expect(mainPannerNode.name).toBe('StereoPannerNode');
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

      const [
        filterNode,
        mainFadeNode,
        mainGainNode,
        mainPannerNode,
        convolverNode,
      ] = getNodeChain(getAudioGraph(channelsInstance));

      expect(filterNode.name).toBe('BiquadFilterNode');
      expect(mainFadeNode.name).toBe('GainNode');
      expect(mainPannerNode.name).toBe('StereoPannerNode');
      expect(mainGainNode.name).toBe('GainNode');
      expect(convolverNode.name).toBe('ConvolverNode');
    });
  });
});
