import { Channels } from './Channels';
import { VolumeNodes } from './VolumeNodes';
import { HasVolume, PlayStopOptions } from './types';

export type ChannelType = 'monophonic' | 'polyphonic';

export type CreateChannelOptions = {
  type?: ChannelType;
  volume?: number;
};

type PlayParameters = Parameters<InstanceType<typeof Channels>['play']>;

export class Channel implements HasVolume {
  public readonly type: ChannelType;
  public readonly volumeNodes: VolumeNodes;

  constructor(
    public readonly name: string,
    public readonly channelsInstance: Channels,
    { volume, type = 'polyphonic' }: CreateChannelOptions = {},
    public defaultPlayStopOptions?: PlayStopOptions
  ) {
    this.type = type;

    this.volumeNodes = new VolumeNodes(
      channelsInstance.audioContext,
      channelsInstance,
      this,
      volume
    );

    this.volumeNodes.output.connect(this.channelsInstance.volumeNodes.input);
  }

  /**
   * Play a sounds on the channel.
   * @param name
   * @param options
   */
  public play = (
    name: PlayParameters[0],
    options: Omit<PlayParameters[1], 'channel'> = {}
  ) => {
    this.channelsInstance.play(name, { channel: this.name, ...options });
  };

  /**
   * Stop all playing sounds on the channel
   */
  public stopAll = () => {
    this.channelsInstance.stopAll({ channel: this.name });
  };

  /*
  HasVolume implementations
   */
  public fadeIn = (duration: number, onComplete?: () => void): void =>
    this.volumeNodes.fadeIn(duration, onComplete);
  public fadeOut = (duration: number, onComplete?: () => void): void =>
    this.volumeNodes.fadeOut(duration, onComplete);
  public mute = () => this.volumeNodes.mute();
  public unmute = () => this.volumeNodes.unmute();
  public getFadeVolume = () => this.volumeNodes.getFadeVolume();
  public getVolume = () => this.volumeNodes.getVolume();
  public setVolume = (value: number) => this.volumeNodes.setVolume(value);
}
