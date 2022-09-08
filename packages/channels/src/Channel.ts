import { Channels } from './Channels';
import {
  ChannelType,
  CreateChannelOptions,
  PlayStopOptions,
  StopAllOptions,
} from './types';
import { VolumeChangeEvent } from './event/VolumeChangeEvent';
import { PanChangeEvent } from './event/PanChangeEvent';
import { HasSignalModifier } from './HasSignalModifier';

type PlayParameters = Parameters<InstanceType<typeof Channels>['play']>;

export class Channel extends HasSignalModifier {
  public readonly type: ChannelType;
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
    super(channelsInstance.audioContext, {
      volume,
      pan,
      effects,
    });

    this.type = type;
    this.defaultPlayStopOptions = defaultPlayStopOptions;

    this.signalModifier.output.connect(channelsInstance.getInput());

    // redispatch events from signal modifier
    this.signalModifier.addEventListener(
      VolumeChangeEvent.types.VOLUME_CHANGE,
      event => {
        this.dispatchEvent(event);
      }
    );
    this.signalModifier.addEventListener(
      PanChangeEvent.types.PAN_CHANGE,
      event => {
        this.dispatchEvent(event);
      }
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
}
