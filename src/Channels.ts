import { SoundChannel, SoundChannelType } from './types';

type AddChannelOptions = {
  initialVolume?: number;
};

export class Channels {
  private readonly context: AudioContext;
  private readonly channels: Record<string, SoundChannel> = {};

  constructor(audioContext: AudioContext) {
    this.context = audioContext;
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
