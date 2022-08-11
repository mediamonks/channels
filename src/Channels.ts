import { SoundChannel } from './types';

type ChannelsProps = {
  audioContext?: AudioContext;
};

export class Channels {
  private readonly context!: AudioContext;
  private readonly channels: Record<string, SoundChannel> = {};

  constructor(props: ChannelsProps) {
    console.log('hi');
  }

  // public createChannel(
  //     name: string,
  //     initialVolume = 1,
  //     isMonophonic = false,
  //     monophonicFadeOutTime = 0,
  // ): void {
  //
  //         if (name === '') {
  //             throw new Error('Channel name cannot be blank');
  //         }
  //         if (this.channels[name]) {
  //             throw new Error(`Channel '${name}' already exists`);
  //         }
  //         if (monophonicFadeOutTime < 0) {
  //             throw new Error('monophonicFadeOutTime can not be negative');
  //         }
  //
  //         const gain = this.context.createGain();
  //         gain.gain.setValueAtTime(initialVolume, 0);
  //         gain.connect(this.context.destination);
  //         gain.connect(this.context.destination);
  //
  //         this.channels[name] = {
  //             initialVolume,
  //             isMonophonic,
  //             monophonicFadeOutTime,
  //             name,
  //             gain,
  //             playingSamples: [],
  //         };
  //
  // }
}
