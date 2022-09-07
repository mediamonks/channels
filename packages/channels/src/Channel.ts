import { Channels } from './Channels';
import {
  CanConnectMediaElement,
  ChannelType,
  CreateChannelOptions,
  PlayStopOptions,
  StopAllOptions,
} from './types';
import { SignalModifier } from './SignalModifier';

type PlayParameters = Parameters<InstanceType<typeof Channels>['play']>;

export class Channel implements CanConnectMediaElement {
  public readonly type: ChannelType;
  public readonly signalModifier: SignalModifier;
  public readonly defaultPlayStopOptions: PlayStopOptions | undefined;

  constructor(
    public readonly name: string,
    public readonly channelsInstance: Channels,
    {
      volume,
      type = 'polyphonic',
      effects,
      pan,
      defaultPlayStopOptions,
    }: CreateChannelOptions = {}
  ) {
    this.type = type;
    this.defaultPlayStopOptions = defaultPlayStopOptions;

    this.signalModifier = new SignalModifier(
      channelsInstance.audioContext,
      channelsInstance,
      this,
      {
        volume,
        pan,
        effects,
      }
    );

    this.signalModifier.output.connect(
      this.channelsInstance.signalModifier.input
    );
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
  HasSignalModifier implementations
   */
  public fadeIn = (duration: number, onComplete?: () => void): void =>
    this.signalModifier.fadeIn(duration, onComplete);
  public fadeOut = (duration: number, onComplete?: () => void): void =>
    this.signalModifier.fadeOut(duration, onComplete);
  public mute = () => this.signalModifier.mute();
  public unmute = () => this.signalModifier.unmute();
  public getFadeVolume = () => this.signalModifier.getFadeVolume();
  public getVolume = () => this.signalModifier.getVolume();
  public setVolume = (value: number) => this.signalModifier.setVolume(value);
  public connectMediaElement = (element: HTMLMediaElement) =>
    this.signalModifier.connectMediaElement(element);
  public getPan = () => this.signalModifier.getPan();
  public setPan = (value: number) => this.signalModifier.setPan(value);
}
