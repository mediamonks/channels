import { Channels } from './Channels';
import { VolumeNodes, VolumeOptions } from './VolumeNodes';

export type SoundChannelType = 'monophonic' | 'polyphonic';

export type CreateSoundChannelOptions = {
  type?: SoundChannelType;
} & VolumeOptions;

type PlayParameters = Parameters<InstanceType<typeof Channels>['play']>;

export class SoundChannel {
  public readonly volumeNodes: VolumeNodes;
  public readonly type: SoundChannelType;

  constructor(
    public readonly name: string,
    public readonly channelsInstance: Channels,
    {
      initialVolume,
      initialMuted,
      type = 'polyphonic',
    }: CreateSoundChannelOptions = {}
  ) {
    this.type = type;
    this.volumeNodes = new VolumeNodes(channelsInstance.audioContext, {
      initialVolume,
      initialMuted,
    });
    this.volumeNodes.output.connect(
      this.channelsInstance.mainVolumeNodes.input
    );
  }

  public play(
    name: PlayParameters[0],
    options: Omit<PlayParameters[1], 'channel'> = {}
  ) {
    this.channelsInstance.play(name, { channel: this.name, ...options });
  }

  // arrow notation to bind 'this', in case sound.stop is passed as a handler
  public stopAll = () => {
    this.channelsInstance.stopAll({ channel: this.name });
  };
}
