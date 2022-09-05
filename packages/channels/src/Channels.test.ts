import { Channels } from './Channels';
import 'web-audio-test-api';
import SampleManager from 'sample-manager';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import { mockXMLHttpRequest } from './test/mockXMLHttpRequest';
import { mockChannelsInstance } from './test/mockChannelsInstance';
import { getAudioGraph } from './test/getAudioGraph';

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
});
