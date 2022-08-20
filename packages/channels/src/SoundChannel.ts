import { Channels } from './Channels';
import { Volume, VolumeOptions } from './util/Volume';

export type SoundChannelType = 'monophonic' | 'polyphonic';

export class SoundChannel {
  public readonly volume: Volume;

  constructor(
    public readonly name: string,
    public readonly channelsInstance: Channels,
    public readonly type: SoundChannelType,
    { initialVolume, initialMuted }: VolumeOptions = {}
  ) {
    this.volume = new Volume(channelsInstance.audioContext, {
      initialVolume,
      initialMuted,
    });
    this.volume.output.connect(this.channelsInstance.mainVolume.input);
  }
}
