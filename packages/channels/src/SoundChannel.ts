import { Channels } from './Channels';
import { Volume, VolumeOptions } from './util/Volume';

export type SoundChannelType = 'monophonic' | 'polyphonic';

export type CreateSoundChannelOptions = {
  type?: SoundChannelType;
} & VolumeOptions;

type PlayParameters = Parameters<InstanceType<typeof Channels>['play']>;

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

  public play(
    name: PlayParameters[0],
    options: Omit<PlayParameters[1], 'channel'> = {}
  ) {
    this.channelsInstance.play(name, { channel: this.name, ...options });
  }

  public stopAll() {
    this.channelsInstance.stopAll({ channel: this.name });
  }
}
