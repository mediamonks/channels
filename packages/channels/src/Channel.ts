import { Channels } from './Channels';
import { VolumeNodes, VolumeOptions } from './VolumeNodes';
import { HasVolumeNodes } from './HasVolumeNodes';

export type ChannelType = 'monophonic' | 'polyphonic';

export type CreateChannelOptions = {
  type?: ChannelType;
} & VolumeOptions;

type PlayParameters = Parameters<InstanceType<typeof Channels>['play']>;

export class Channel extends HasVolumeNodes {
  public readonly type: ChannelType;

  constructor(
    public readonly name: string,
    public readonly channelsInstance: Channels,
    {
      initialVolume,
      initialMuted,
      type = 'polyphonic',
    }: CreateChannelOptions = {}
  ) {
    super();

    this.type = type;

    this.setVolumeNodes(
      new VolumeNodes(channelsInstance.audioContext, {
        initialVolume,
        initialMuted,
      })
    );

    this.volumeNodes.output.connect(this.channelsInstance.volumeNodes.input);
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
