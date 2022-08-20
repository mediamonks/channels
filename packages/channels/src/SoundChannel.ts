import { Channels } from './Channels';
import { Volume, VolumeOptions } from './util/Volume';

export type SoundChannelType = 'monophonic' | 'polyphonic';

export type CreateSoundChannelOptions = {
  type?: SoundChannelType;
} & VolumeOptions;

export class SoundChannel {
  public readonly volume: Volume;
  public readonly type: SoundChannelType;

  constructor(
    public readonly name: string,
    public readonly channelsInstance: Channels,
    {
      initialVolume,
      initialMuted,
      type = 'monophonic',
    }: CreateSoundChannelOptions = {}
  ) {
    this.type = type;
    this.volume = new Volume(channelsInstance.audioContext, {
      initialVolume,
      initialMuted,
    });
    this.volume.output.connect(this.channelsInstance.mainVolume.input);
  }
}
