import { Channels } from './Channels';
import { VolumeNodes } from './VolumeNodes';
import {
  CanConnectMediaElement,
  Effects,
  PlayStopOptions,
  StopAllOptions,
} from './types';

export type ChannelType = 'monophonic' | 'polyphonic';

export type CreateChannelOptions = {
  type?: ChannelType;
  volume?: number;
  panning?: number;
  effects?: Effects;
  defaultPlayStopOptions?: PlayStopOptions;
};

type PlayParameters = Parameters<InstanceType<typeof Channels>['play']>;

export class Channel implements CanConnectMediaElement {
  public readonly type: ChannelType;
  public readonly volumeNodes: VolumeNodes;
  public readonly defaultPlayStopOptions: PlayStopOptions | undefined;

  constructor(
    public readonly name: string,
    public readonly channelsInstance: Channels,
    {
      volume,
      type = 'polyphonic',
      effects,
      panning,
      defaultPlayStopOptions,
    }: CreateChannelOptions = {}
  ) {
    this.type = type;
    this.defaultPlayStopOptions = defaultPlayStopOptions;

    this.volumeNodes = new VolumeNodes(
      channelsInstance.audioContext,
      channelsInstance,
      this,
      {
        volume,
        panning,
        effects,
      }
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
  public stopAll = ({ immediate }: Omit<StopAllOptions, 'channel'>) => {
    this.channelsInstance.stopAll({ channel: this.name, immediate });
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
  public connectMediaElement = (element: HTMLMediaElement) =>
    this.volumeNodes.connectMediaElement(element);
  public getPanning = () => this.volumeNodes.getPanning();
  public setPanning = (value: number) => this.volumeNodes.setPanning(value);
}
