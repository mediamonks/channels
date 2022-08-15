import { CreateSample, SoundChannel, SoundChannelType } from './types';
import { AudioContext } from './util/audioContext';
import SampleManager from 'sample-manager';

type AddChannelOptions = {
  initialVolume?: number;
};

type ConstructorProps = {
  samplesPath: string;
  samplesExtension: string;
  audioContext?: AudioContext;
  samples?: Array<CreateSample>;
};

export class Channels {
  private readonly context: AudioContext;
  private readonly channels: Record<string, SoundChannel> = {};
  public readonly sampleManager: SampleManager;

  constructor({
    audioContext,
    samplesExtension,
    samplesPath,
    samples,
  }: ConstructorProps) {
    this.context = audioContext || new AudioContext();

    if (!this.context) {
      throw new Error('Failed to create an AudioContext');
    }

    this.sampleManager = new SampleManager(
      this.context,
      samplesPath,
      samplesExtension
    );

    if (samples && samples.length > 0) {
      this.sampleManager.addSamples(samples);
    }
  }

  public loadAllSamples(onProgress?: (value: number) => void) {
    return this.sampleManager.loadAllSamples(onProgress);
  }

  public addChannel(
    name: string,
    type: SoundChannelType,
    { initialVolume = 1 }: AddChannelOptions
  ) {
    if (name === '') {
      throw new Error('Channel name cannot be blank');
    }
    if (this.channels[name]) {
      throw new Error(`Channel '${name}' already exists`);
    }
    // if (monophonicFadeOutTime < 0) {
    //   throw new Error('monophonicFadeOutTime can not be negative');
    // }

    const gain = this.context.createGain();
    gain.gain.setValueAtTime(initialVolume, 0);
    gain.connect(this.context.destination);

    this.channels[name] = {
      initialVolume,
      type,
      name,
      gain,
      playingSamples: [],
    };
  }
}
